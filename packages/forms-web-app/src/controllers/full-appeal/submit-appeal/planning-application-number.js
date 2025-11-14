const {
	VIEW: {
		FULL_APPEAL: { PLANNING_APPLICATION_NUMBER, EMAIL_ADDRESS }
	}
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const config = require('../../../config');
const { caseTypeLookup } = require('@pins/common/src/database/data-static');

exports.getPlanningApplicationNumber = (views = { PLANNING_APPLICATION_NUMBER, EMAIL_ADDRESS }) => {
	return (req, res) => {
		const { appeal } = req.session;
		const { planningApplicationNumber } = appeal;
		const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;
		res.render(views.PLANNING_APPLICATION_NUMBER, {
			planningApplicationNumber,
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
		});
	};
};

exports.postPlanningApplicationNumber = (
	views = { PLANNING_APPLICATION_NUMBER, EMAIL_ADDRESS }
) => {
	return async (req, res) => {
		const { body } = req;
		const { errors = {}, errorSummary = [] } = body;

		const {
			appeal,
			appeal: { planningApplicationNumber }
		} = req.session;
		const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;

		if (Object.keys(errors).length > 0) {
			return res.render(views.PLANNING_APPLICATION_NUMBER, {
				planningApplicationNumber,
				errors,
				errorSummary,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
			});
		}

		try {
			appeal.planningApplicationNumber = body['application-number'];
			req.session.appeal = await createOrUpdateAppeal(appeal);
		} catch (e) {
			logger.error(e);
			res.render(views.PLANNING_APPLICATION_NUMBER, {
				planningApplicationNumber,
				errors,
				errorSummary: [{ text: e.toString(), href: '#' }]
			});
			return;
		}

		res.redirect(`/${views.EMAIL_ADDRESS}`);
	};
};
