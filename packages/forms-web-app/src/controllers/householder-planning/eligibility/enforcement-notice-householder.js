const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { ENFORCEMENT_NOTICE_HOUSEHOLDER: currentPage }
		}
	}
} = require('../../../lib/householder-planning/views');
const {
	validEnforcementNoticeHouseholderOptions
} = require('../../../validators/householder-planning/eligibility/enforcement-notice-householder');

const navigationPages = {
	nextPage: '/before-you-start/claiming-costs-householder',
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

	res.redirect(navigationPages.nextPage);
};
