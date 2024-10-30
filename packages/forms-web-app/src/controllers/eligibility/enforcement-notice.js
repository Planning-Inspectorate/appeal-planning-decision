const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const {
	validEnforcementNoticeOptions
} = require('../../validators/eligibility/enforcement-notice');
const config = require('../../config');

exports.getServiceNotAvailableWhenReceivedEnforcementNotice = (req, res) => {
	res.render(VIEW.ELIGIBILITY.ENFORCEMENT_NOTICE_OUT, {
		bannerHtmlOverride: config.betaBannerText
	});
};

exports.getEnforcementNotice = (req, res) => {
	res.render(VIEW.ELIGIBILITY.ENFORCEMENT_NOTICE, {
		bannerHtmlOverride: config.betaBannerText,
		appeal: req.session.appeal
	});
};

exports.postEnforcementNotice = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;

	let hasReceivedEnforcementNotice = null;
	if (validEnforcementNoticeOptions.includes(req.body['enforcement-notice'])) {
		hasReceivedEnforcementNotice = req.body['enforcement-notice'] === 'yes';
	}

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.ELIGIBILITY.ENFORCEMENT_NOTICE, {
			bannerHtmlOverride: config.betaBannerText,
			appeal: {
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementNotice: hasReceivedEnforcementNotice
				}
			},
			errors,
			errorSummary
		});
		return;
	}

	try {
		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			eligibility: {
				...appeal.eligibility,
				enforcementNotice: hasReceivedEnforcementNotice
			}
		});
	} catch (e) {
		logger.error(e);

		res.render(VIEW.ELIGIBILITY.ENFORCEMENT_NOTICE, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (hasReceivedEnforcementNotice) {
		res.redirect(`/${VIEW.ELIGIBILITY.ENFORCEMENT_NOTICE_OUT}`);
		return;
	}

	res.redirect(`/${VIEW.ELIGIBILITY.LISTED_BUILDING}`);
};
