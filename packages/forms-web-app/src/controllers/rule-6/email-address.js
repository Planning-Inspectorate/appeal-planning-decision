const {
	setSessionEmail,
	getSessionEmail,
	setSessionEnterCodeAction
} = require('../../lib/session-helper');
const { enterCodeConfig } = require('@pins/common');
const { logoutUser } = require('../../services/user.service');
const logger = require('../../lib/logger');
const config = require('../../config');
const { getAuthClientConfig, createOTPGrant } = require('@pins/common/src/client/auth-client');
const { isRule6UserByEmail } = require('../../services/user.service');

/**
 * @param {{EMAIL_ADDRESS: string}} views
 * @returns {import('express').RequestHandler}
 */
const getR6EmailAddress = (views) => {
	return (req, res) => {
		const email = getSessionEmail(req.session, false);
		res.render(views.EMAIL_ADDRESS, {
			email
		});
	};
};

/**
 * @param {{EMAIL_ADDRESS: string, ENTER_CODE: string}} views
 * @returns {import('express').RequestHandler}
 */
const postR6EmailAddress = (views) => {
	return async (req, res) => {
		const { body } = req;
		const { errors = {}, errorSummary = [] } = body;
		const emailErrorSummary = [
			{
				text: 'Enter your email address',
				href: '#email-address'
			}
		];

		const email = body['email-address']?.trim();
		setSessionEmail(req.session, email, false);

		if (!email) {
			res.render(views.EMAIL_ADDRESS, {
				errors,
				errorSummary: emailErrorSummary
			});
			return;
		}

		if (Object.keys(errors).length > 0) {
			res.render(views.EMAIL_ADDRESS, {
				email,
				errors,
				errorSummary
			});
			return;
		}

		try {
			logoutUser(req);
			setSessionEnterCodeAction(req.session, enterCodeConfig.actions.rule6Dashboard);
			const isRule6User = await isRule6UserByEmail(req, email);
			if (isRule6User) {
				await getAuthClientConfig(
					config.oauth.baseUrl,
					config.oauth.clientID,
					config.oauth.clientSecret
				);
				await createOTPGrant(email, enterCodeConfig.actions.rule6Dashboard);
			}
		} catch (e) {
			logger.error(e, 'failed to send token to rule 6 user');
		}

		res.redirect(`/${views.ENTER_CODE}`);
	};
};

module.exports = {
	getR6EmailAddress,
	postR6EmailAddress
};
