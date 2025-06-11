const logger = require('../../lib/logger');
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
	const { eligibleDepartments } = await getRefreshedDepartmentData();
	const { appeal } = req.session;
	let appealLPD = '';
	if (appeal.lpaCode) {
		const lpd = await getDepartmentFromId(appeal.lpaCode);
		if (lpd) {
			appealLPD = lpd.name;
		}
	}

	res.render(VIEW.FULL_APPEAL.LOCAL_PLANNING_AUTHORITY, {
		appealLPD,
		departments: departmentsToNunjucksItems(eligibleDepartments, appealLPD)
	});
};

exports.postPlanningDepartment = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;
	const { eligibleDepartments } = await getRefreshedDepartmentData();

	if (errors['local-planning-department']) {
		return res.render(VIEW.FULL_APPEAL.LOCAL_PLANNING_AUTHORITY, {
			appealLPD: '',
			departments: departmentsToNunjucksItems(eligibleDepartments),
			errors,
			errorSummary
		});
	}

	const lpaName = body['local-planning-department'];
	const lpa = await getDepartmentFromName(lpaName);

	appeal.lpaCode = lpa.id;
	try {
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);

		return res.render(VIEW.FULL_APPEAL.LOCAL_PLANNING_AUTHORITY, {
			appeal,
			departments: departmentsToNunjucksItems(eligibleDepartments, lpaName),
			errors,
			errorSummary: [{ text: e.toString(), href: 'local-planning-department' }]
		});
	}

	return res.redirect(`/before-you-start/enforcement-notice`);
};
