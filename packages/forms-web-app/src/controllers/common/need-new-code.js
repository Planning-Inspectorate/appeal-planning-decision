const logger = require('../../lib/logger');
const config = require('../../config');
const { enterCodeConfig } = require('@pins/common');
const { getAuthClientConfig, createOTPGrant } = require('@pins/common/src/client/auth-client');
const {
	getSessionEmail,
	getSessionEnterCodeAction,
	setSessionNewCode
} = require('../../lib/session-helper');
const { isRule6UserByEmail } = require('../../services/user.service');

const getNeedNewCode = (views) => {
	return async (_, res) => {
		res.render(views.NEED_NEW_CODE);
	};
};

const sendToken = async (email, action) => {
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

const postNeedNewCode = (views) => {
	return async (req, res) => {
		setSessionNewCode(req.session);
		const email = getSessionEmail(req.session, false);
		const action = getSessionEnterCodeAction(req.session);

		await sendToken(email, action);

		const url = `/${views.ENTER_CODE}`;
		res.redirect(url);
	};
};

const postNeedNewCodeLPA = (views) => {
	return async (req, res) => {
		setSessionNewCode(req.session);
		const email = getSessionEmail(req.session, false);

		await sendToken(email, enterCodeConfig.actions.lpaDashboard);

		const url = `/${views.ENTER_CODE}`;
		res.redirect(url);
	};
};

const postNeedNewCodeRule6 = (views) => {
	return async (req, res) => {
		setSessionNewCode(req.session);

		const email = getSessionEmail(req.session, false);

		const isValidRule6 = await isRule6UserByEmail(req, email);
		if (isValidRule6) {
			await sendToken(email, enterCodeConfig.actions.rule6Dashboard);
		}

		const url = `/${views.ENTER_CODE}`;
		res.redirect(url);
	};
};

module.exports = {
	getNeedNewCode,
	postNeedNewCode,
	postNeedNewCodeLPA,
	postNeedNewCodeRule6
};
