const logger = require('../../../lib/logger');
const { createOrUpdateAppeal, getLPAById } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { ENFORCEMENT_NOTICE_HOUSEHOLDER: currentPage }
		}
	}
} = require('../../../lib/views');
const {
	validEnforcementNoticeHouseholderOptions
} = require('../../../validators/householder-planning/eligibility/enforcement-notice-householder');
const { getDepartmentFromId } = require('../../../services/department.service');
const { isFeatureActive } = require('../../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');

const navigationPages = {
	nextPage: '/before-you-start/claiming-costs-householder',
	v2NextPage: '/before-you-start/can-use-service',
	shutterPage: '/before-you-start/use-existing-service-enforcement-notice'
};

exports.getEnforcementNoticeHouseholder = (req, res) => {
	const { appeal } = req.session;

	res.render(currentPage, {
		enforcementNotice: appeal.eligibility.enforcementNotice
	});
};

exports.postEnforcementNoticeHouseholder = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	let hasReceivedEnforcementNoticeHouseholder = null;
	if (validEnforcementNoticeHouseholderOptions.includes(req.body['enforcement-notice'])) {
		hasReceivedEnforcementNoticeHouseholder = req.body['enforcement-notice'] === 'yes';
	}

	if (Object.keys(errors).length > 0) {
		res.render(currentPage, {
			enforcementNotice: appeal.eligibility.enforcementNotice,
			errors,
			errorSummary
		});
		return;
	}

	appeal.eligibility.enforcementNotice = hasReceivedEnforcementNoticeHouseholder;
	try {
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);

		res.render(currentPage, {
			enforcementNotice: appeal.eligibility.enforcementNotice,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (hasReceivedEnforcementNoticeHouseholder) {
		res.redirect(navigationPages.shutterPage);
		return;
	}

	// skip next question if using v2
	const lpa = await getDepartmentFromId(appeal.lpaCode);
	const lpaCode = lpa.lpaCode ?? (await getLPAById(lpa.id)).lpaCode; // fallback to lookup in case cached lpa doesn't have code
	const usingV2Form = await isFeatureActive(FLAG.HAS_QUESTIONNAIRE, lpaCode);

	if (usingV2Form) {
		return res.redirect(navigationPages.v2NextPage);
	}

	res.redirect(navigationPages.nextPage);
};
