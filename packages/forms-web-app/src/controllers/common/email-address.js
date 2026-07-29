const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { ApiClientError } = require('@pins/common/src/client/api-client-error');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../lib/logger');
const {
	setSessionAppeal,
	getSessionAppeal,
	setSessionEmail,
	setSessionEnterCodeAction
} = require('../../lib/session-helper');
const { logoutUser } = require('../../services/user.service');
const config = require('../../config');
const { caseTypeLookup } = require('@pins/common/src/database/data-static');
const { getAuthClientConfig, createOTPGrant } = require('@pins/common/src/client/auth-client');

const getEmailAddress = (views, appealInSession) => {
	return (req, res) => {
		const { email } = appealInSession ? req.session.appeal : req.session;
		const appealType = caseTypeLookup(req.session?.appeal?.appealType, 'id')?.processCode;

		res.render(views.EMAIL_ADDRESS, {
			email,
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
		});
	};
};

/**
 * @param {import('express').Request} req
 * @param {string} email
 * @param {string} action
 * @returns {Promise<void>}
 */
const sendTokenToUser = async (req, email, action) => {
	logoutUser(req);
	setSessionEnterCodeAction(req.session, action);
	try {
		await getAuthClientConfig(
			config.oauth.baseUrl,
			config.oauth.clientID,
			config.oauth.clientSecret
		);
		await createOTPGrant(email, action);
	} catch (e) {
		logger.error(e, 'failed to send token to general login user');
	}
};

const postEmailAddress = (views, appealInSession) => {
	return async (req, res) => {
		const { body } = req;
		const { errors = {}, errorSummary = [] } = body;

		const email = body['email-address']?.trim();
		setSessionEmail(req.session, email, appealInSession);
		let appeal;
		let appealType;
		if (appealInSession) {
			appeal = getSessionAppeal(req.session);
			appealType = caseTypeLookup(appeal?.appealType, 'id')?.processCode;
		}

		if (Object.keys(errors).length > 0) {
			res.render(views.EMAIL_ADDRESS, {
				email,
				errors,
				errorSummary,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
			});
			return;
		}

		if (appealInSession) {
			try {
				setSessionAppeal(req.session, await createOrUpdateAppeal(appeal));
				await sendTokenToUser(req, email, enterCodeConfig.actions.confirmEmail);
				res.redirect(`/${views.ENTER_CODE}`);
				return;
			} catch (e) {
				logger.error(e);
				res.render(views.EMAIL_ADDRESS, {
					email,
					errors,
					errorSummary: [{ text: e.toString(), href: '#' }],
					bannerHtmlOverride:
						config.betaBannerText +
						config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
				});
				return;
			}
		}

		let user;

		try {
			user = await req.appealsApiClient.getUserByEmailV2(email);
		} catch (err) {
			if (!(err instanceof ApiClientError) || err.code != 404) {
				throw err;
			}
		}

		if (!user) {
			user = await req.appealsApiClient.createUser({
				email: email
			});
		}

		await sendTokenToUser(req, email, enterCodeConfig.actions.saveAndReturn);
		res.redirect(`/${views.ENTER_CODE}`);
	};
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
