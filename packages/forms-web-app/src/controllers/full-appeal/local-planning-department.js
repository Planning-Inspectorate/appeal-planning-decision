const logger = require('../../lib/logger');
const config = require('../../config');
const {
	getDepartmentFromName,
	getDepartmentFromId,
	getRefreshedDepartmentData
} = require('../../services/department.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	departmentsToNunjucksItems
} = require('../../lib/planning-departments-to-nunjucks-list-items');
const { VIEW } = require('../../lib/views');

exports.getPlanningDepartment = async (req, res) => {
	const { departments, eligibleDepartments, ineligibleDepartments } =
		await getRefreshedDepartmentData();
	const { appeal } = req.session;
	let appealLPD = '';
	if (appeal.lpaCode) {
		const lpd = await getDepartmentFromId(appeal.lpaCode);
		if (lpd) {
			appealLPD = lpd.name;
		}
	}

	res.render(VIEW.FULL_APPEAL.LOCAL_PLANNING_DEPARTMENT, {
		bannerHtmlOverride: config.betaBannerText,
		appealLPD,
		departments: departmentsToNunjucksItems(departments, appealLPD),
		eligibleDepartments,
		ineligibleDepartments
	});
};

exports.postPlanningDepartment = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;
	const { departments } = await getRefreshedDepartmentData();

	if (errors['local-planning-department']) {
		const errorMessage = errors['local-planning-department'].msg;

		if (errorMessage !== 'Ineligible Department') {
			res.render(VIEW.FULL_APPEAL.LOCAL_PLANNING_DEPARTMENT, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: '',
				departments: departmentsToNunjucksItems(departments),
				errors,
				errorSummary
			});
			return;
		}

		res.redirect(`/before-you-start/use-existing-service-local-planning-department`);
		return;
	}

	const lpaName = body['local-planning-department'];
	const lpa = await getDepartmentFromName(lpaName);

	appeal.lpaCode = lpa.id;
	try {
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);

		res.render(VIEW.FULL_APPEAL.LOCAL_PLANNING_DEPARTMENT, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			departments: departmentsToNunjucksItems(departments, lpaName),
			errors,
			errorSummary: [{ text: e.toString(), href: 'local-planning-department' }]
		});
		return;
	}

	res.redirect(`/before-you-start/type-of-planning-application`);
	// eslint-disable-next-line no-useless-return
	return;
};
