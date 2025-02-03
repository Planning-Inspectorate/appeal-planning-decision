const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { ENFORCEMENT_NOTICE }
	}
} = require('../../lib/views');
const {
	validEnforcementNoticeOptions
} = require('../../validators/before-you-start/enforcement-notice');
const config = require('../../config');

exports.getEnforcementNotice = (req, res) => {
	const { appeal } = req.session;
	res.render(ENFORCEMENT_NOTICE, {
		bannerHtmlOverride: config.betaBannerText,
		appeal
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
		res.render(ENFORCEMENT_NOTICE, {
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

		res.render(ENFORCEMENT_NOTICE, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (hasReceivedEnforcementNotice) {
		res.redirect('/before-you-start/use-existing-service-enforcement-notice');
		return;
	}

	res.redirect('/before-you-start/type-of-planning-application');
};
