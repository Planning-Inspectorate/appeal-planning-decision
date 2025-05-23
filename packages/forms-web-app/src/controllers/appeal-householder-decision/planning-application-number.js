const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { VIEW } = require('../../lib/views');
const config = require('../../config');
const {
	typeOfPlanningApplicationToAppealTypeMapper
} = require('#lib/full-appeal/map-planning-application');

const getPlanningApplicationNumber = (req, res) => {
	const { appeal } = req.session;
	const { planningApplicationNumber } = appeal;
	const appealType = typeOfPlanningApplicationToAppealTypeMapper[appeal.typeOfPlanningApplication];

	return res.render('appeal-householder-decision/planning-application-number', {
		planningApplicationNumber,
		bannerHtmlOverride:
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
	});
};

const postPlanningApplicationNumber = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const {
		appeal,
		appeal: { planningApplicationNumber }
	} = req.session;
	const appealType = typeOfPlanningApplicationToAppealTypeMapper[appeal.typeOfPlanningApplication];

	if (Object.keys(errors).length > 0) {
		return res.render('appeal-householder-decision/planning-application-number', {
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
		return res.render('appeal-householder-decision/planning-application-number', {
			planningApplicationNumber,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }],
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
		});
	}

	return res.redirect('/' + VIEW.APPELLANT_SUBMISSION.EMAIL_ADDRESS);
};

module.exports = {
	getPlanningApplicationNumber,
	postPlanningApplicationNumber
};
