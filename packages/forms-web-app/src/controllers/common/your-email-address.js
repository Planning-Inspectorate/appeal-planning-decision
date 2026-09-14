const { logoutUser } = require('../../services/user.service');
const logger = require('../../lib/logger');
const { enterCodeConfig } = require('@pins/common');
const config = require('../../config');
const { getAuthClientConfig, createOTPGrant } = require('@pins/common/src/client/auth-client');
const { setSessionEnterCodeAction, setSessionEmail } = require('../../lib/session-helper');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

const getYourEmailAddressLPA = (views) => {
	return (req, res) => {
		const { email } = req.session;
		res.render(views.YOUR_EMAIL_ADDRESS, {
			email: email
		});
	};
};

const postYourEmailAddressLPA = (views) => {
	return async (req, res) => {
		const { body } = req;
		const { errors = {}, errorSummary = [], 'email-address': email } = body;
		const emailErrorSummary = [
			{
				text: 'Enter an email address in the correct format, like name@example.com',
				href: '#your-email-address'
			}
		];
		if (!email) {
			return res.render(views.YOUR_EMAIL_ADDRESS, {
				errors,
				errorSummary: emailErrorSummary
			});
		}

		if (Object.keys(errors).length > 0) {
			logger.error('errors', errors);
			return res.render(views.YOUR_EMAIL_ADDRESS, {
				email,
				errors,
				errorSummary
			});
		}

		logoutUser(req);

		setSessionEnterCodeAction(req.session, enterCodeConfig.actions.lpaDashboard);
		setSessionEmail(req.session, email);

		try {
			const user = await req.appealsApiClient.getUserByEmailV2(email);
			if (user?.lpaCode && user.lpaStatus !== STATUS_CONSTANTS.REMOVED) {
				await getAuthClientConfig(
					config.oauth.baseUrl,
					config.oauth.clientID,
					config.oauth.clientSecret
				);
				await createOTPGrant(email, enterCodeConfig.actions.lpaDashboard);
			}
		} catch (e) {
			logger.error(e, 'failed to send token to lpa user');
		}

		res.redirect(`/${views.ENTER_CODE}`);
	};
};

module.exports = {
	getYourEmailAddressLPA,
	postYourEmailAddressLPA
};
