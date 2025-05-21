const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { enterCodeConfig } = require('@pins/common');
const { VIEW } = require('../../lib/views');
const { logoutUser } = require('../../services/user.service');
const config = require('../../config');
const {
	typeOfPlanningApplicationToAppealTypeMapper
} = require('#lib/full-appeal/map-planning-application');

const getEmailAddress = (req, res) => {
	const {
		appeal,
		appeal: { email }
	} = req.session;
	const appealType = typeOfPlanningApplicationToAppealTypeMapper[appeal.typeOfPlanningApplication];
	return res.render(VIEW.APPELLANT_SUBMISSION.EMAIL_ADDRESS, {
		email,
		bannerHtmlOverride:
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
	});
};

const postEmailAddress = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const {
		appeal,
		appeal: { email }
	} = req.session;
	const appealType = typeOfPlanningApplicationToAppealTypeMapper[appeal.typeOfPlanningApplication];
	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.APPELLANT_SUBMISSION.EMAIL_ADDRESS, {
			email,
			errors,
			errorSummary,
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
		});
	}

	try {
		appeal.email = body['email-address'];
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);
		return res.render(VIEW.APPELLANT_SUBMISSION.EMAIL_ADDRESS, {
			email,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }],
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
		});
	}

	logoutUser(req);
	req.session.enterCode = req.session.enterCode || {};
	req.session.enterCode.action = enterCodeConfig.actions.confirmEmail;

	res.redirect(`/appeal-householder-decision/enter-code/${req.session.appeal.id}`);
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
