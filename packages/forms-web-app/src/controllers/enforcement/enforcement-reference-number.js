const {
	VIEW: {
		ENFORCEMENT: { ENFORCEMENT_REFERENCE_NUMBER, EMAIL_ADDRESS }
	}
} = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const config = require('../../config');

exports.getEnforcementReferenceNumber = (
	views = { ENFORCEMENT_REFERENCE_NUMBER, EMAIL_ADDRESS }
) => {
	return (req, res) => {
		const { appeal } = req.session;
		const { enforcementReferenceNumber } = appeal;
		res.render(views.ENFORCEMENT_REFERENCE_NUMBER, {
			enforcementReferenceNumber,
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('ENFORCEMENT'))
		});
	};
};

exports.postEnforcementReferenceNumber = (
	views = { ENFORCEMENT_REFERENCE_NUMBER, EMAIL_ADDRESS }
) => {
	return async (req, res) => {
		const { body } = req;
		const { errors = {}, errorSummary = [] } = body;

		const {
			appeal,
			appeal: { enforcementReferenceNumber }
		} = req.session;

		if (Object.keys(errors).length > 0) {
			return res.render(views.ENFORCEMENT_REFERENCE_NUMBER, {
				enforcementReferenceNumber,
				errors,
				errorSummary,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('ENFORCEMENT'))
			});
		}

		try {
			appeal.enforcementReferenceNumber = body['reference-number'];
			req.session.appeal = await createOrUpdateAppeal(appeal);
		} catch (e) {
			logger.error(e);
			res.render(views.ENFORCEMENT_REFERENCE_NUMBER, {
				enforcementReferenceNumber,
				errors,
				errorSummary: [{ text: e.toString(), href: '#' }]
			});
			return;
		}

		res.redirect(`/${views.EMAIL_ADDRESS}`);
	};
};
