const logger = require('#lib/logger');
const { enterCodeConfig } = require('@pins/common');
const config = require('../../config');
const { getAuthClientConfig, createOTPGrant } = require('@pins/common/src/client/auth-client');
const {
	getSessionEnterCodeAction,
	getSessionEmail,
	setSessionNewCode
} = require('#lib/session-helper');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

/**
 * @param {string} requestNewCodeView
 * @returns {import('express').RequestHandler}
 */
const getRequestNewCode = (requestNewCodeView) => {
	return async (_, res) => {
		res.render(requestNewCodeView);
	};
};

/**
 * @param {string} requestNewCodeView
 * @returns {import('express').RequestHandler}
 */
const getRequestNewCodeLPA = (requestNewCodeView) => {
	return async (_, res) => {
		res.render(requestNewCodeView);
	};
};

/**
 * @param {string} enterCodeView
 * @returns {import('express').RequestHandler}
 */
const postRequestNewCode = (enterCodeView) => {
	return async (req, res) => {
		setSessionNewCode(req.session);

		const email = getSessionEmail(req.session, false) ?? getSessionEmail(req.session, true);
		const action = getSessionEnterCodeAction(req.session);

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

		res.redirect(`/${enterCodeView}`);
	};
};

/**
 * @param {string} enterCodeView
 * @returns {import('express').RequestHandler}
 */
const postRequestNewCodeLPA = (enterCodeView) => {
	return async (req, res) => {
		try {
			setSessionNewCode(req.session);
			const email = getSessionEmail(req.session, false);
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

		res.redirect(`/${enterCodeView}`);
	};
};

module.exports = {
	getRequestNewCode,
	getRequestNewCodeLPA,
	postRequestNewCode,
	postRequestNewCodeLPA
};
