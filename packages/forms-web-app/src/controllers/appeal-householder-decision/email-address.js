const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { enterCodeConfig } = require('@pins/common');
const { VIEW } = require('../../lib/views');
const { logoutUser } = require('../../services/user.service');
const config = require('../../config');
const { caseTypeLookup } = require('@pins/common/src/database/data-static');
const { getAuthClientConfig, createOTPGrant } = require('@pins/common/src/client/auth-client');
const { setSessionEnterCodeAction } = require('../../lib/session-helper');
const getEmailAddress = (req, res) => {
	const {
		appeal,
		appeal: { email }
	} = req.session;
	const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;
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
	const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;
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
	setSessionEnterCodeAction(req.session, enterCodeConfig.actions.confirmEmail);

	try {
		await getAuthClientConfig(
			config.oauth.baseUrl,
			config.oauth.clientID,
			config.oauth.clientSecret
		);
		await createOTPGrant(email, enterCodeConfig.actions.confirmEmail);
	} catch (e) {
		logger.error(e, 'failed to send token to general login user');
	}

	res.redirect(`/appeal-householder-decision/enter-code`);
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
