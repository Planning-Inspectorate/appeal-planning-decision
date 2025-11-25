const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { ENFORCEMENT_NOTICE_LISTED_BUILDING }
	}
} = require('../../lib/views');
const {
	validEnforcementNoticeListedBuildingOptions
} = require('../../validators/before-you-start/enforcement-notice-listed-building');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');

exports.getEnforcementNoticeListedBuilding = (req, res) => {
	const { appeal } = req.session;
	res.render(ENFORCEMENT_NOTICE_LISTED_BUILDING, {
		appeal
	});
};

exports.postEnforcementNoticeListedBuilding = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	let isEnforcementNoticeForListedBuilding = null;
	if (
		validEnforcementNoticeListedBuildingOptions.includes(
			req.body['enforcement-notice-listed-building']
		)
	) {
		isEnforcementNoticeForListedBuilding = req.body['enforcement-notice-listed-building'] === 'yes';
	}

	if (Object.keys(errors).length > 0) {
		res.render(ENFORCEMENT_NOTICE_LISTED_BUILDING, {
			appeal: {
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementNotice: isEnforcementNoticeForListedBuilding
				}
			},
			errors,
			errorSummary,
			focusErrorSummary: !!errors
		});
		return;
	}

	const appealType = isEnforcementNoticeForListedBuilding
		? APPEAL_ID.ENFORCEMENT_LISTED_BUILDING
		: APPEAL_ID.ENFORCEMENT_NOTICE;

	try {
		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			eligibility: {
				...appeal.eligibility,
				enforcementNoticeListedBuilding: isEnforcementNoticeForListedBuilding
			},
			appealType
		});
	} catch (e) {
		logger.error(e);

		res.render(ENFORCEMENT_NOTICE_LISTED_BUILDING, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (isEnforcementNoticeForListedBuilding) {
		res.redirect('/before-you-start/use-existing-service-enforcement-notice');
		return;
	}

	res.redirect('/before-you-start/enforcement-issue-date');
};
