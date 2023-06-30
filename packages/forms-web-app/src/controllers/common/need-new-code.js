const logger = require('../../lib/logger');
const { sendToken, getUserById } = require('../../lib/appeals-api-wrapper');
const { enterCodeConfig } = require('@pins/common');

const getNeedNewCode = (views) => {
	return async (req, res) => {
		res.render(views.NEED_NEW_CODE);
	};
};

/**
 * Sends a new token to the lpa user referenced by the id in the url params
 * @param {ExpressRequest} req
 * @returns {Promise}
 */
async function resendTokenToLpaUser(req) {
	const user = await getUserById(req.params.id);

	if (user?.email) {
		await sendToken(req.params.id, enterCodeConfig.actions.lpaDashboard, user.email);
		req.session.enterCode = req.session.enterCode || {};
		req.session.enterCode.newCode = true;
	}
}

const postNeedNewCode = (views) => {
	return async (req, res) => {
		try {
			await resendTokenToLpaUser(req);
		} catch (err) {
			logger.error(err);
		}

		// even if we error, return to enter code page so as to not give anyway any user detail
		const url = `/${views.ENTER_CODE}/${req.params.id}`;
		res.redirect(url);
	};
};

module.exports = {
	getNeedNewCode,
	postNeedNewCode
};
