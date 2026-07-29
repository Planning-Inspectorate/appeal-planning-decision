const { createRule6UserSession, isRule6UserByEmail } = require('../../services/user.service');
const { isTokenValid } = require('../../lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../lib/logger');

const {
	getSessionEmail,
	getSessionEnterCodeAction,
	deleteSessionEnterCodeAction,
	getSessionNewCode,
	deleteSessionNewCode
} = require('#lib/session-helper');
const { handleCustomRedirect } = require('#lib/handle-custom-redirect');

/**
 * @typedef {import('#lib/is-token-valid').TokenValidResult} TokenValidResult
 */

/**
 * @param {{
 *  ENTER_CODE: string,
 *  EMAIL_ADDRESS: string,
 *  CODE_EXPIRED: string,
 *  NEED_NEW_CODE: string,
 *  REQUEST_NEW_CODE: string,
 *  DASHBOARD: string
 * }} views
 * @returns {import('express').Handler}
 */
const getEnterCodeR6 = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {} }
		} = req;

		if (Object.keys(errors).length > 0) {
			logger.error(errors, 'failed to send token to returning user');
			return renderEnterCodePage(`/${views.EMAIL_ADDRESS}`);
		}

		const action = getSessionEnterCodeAction(req.session) ?? enterCodeConfig.actions.confirmEmail;

		// show new code success message only once
		const newCode = getSessionNewCode(req.session);
		if (newCode) {
			deleteSessionNewCode(req.session);
		}

		logger.info({ action }, `getEnterCode`);

		return renderEnterCodePage(`/${views.EMAIL_ADDRESS}`);

		/**
		 * @param {string} [confirmEmailUrl]
		 */
		function renderEnterCodePage(confirmEmailUrl) {
			res.render(views.ENTER_CODE, {
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
				confirmEmailLink: confirmEmailUrl,
				showNewCode: newCode
			});
		}
	};
};

/**
 * @param {{
 *  ENTER_CODE: string,
 *  EMAIL_ADDRESS: string,
 *  CODE_EXPIRED: string,
 *  NEED_NEW_CODE: string,
 *  REQUEST_NEW_CODE: string,
 *  DASHBOARD: string
 * }} views
 * @returns {import('express').Handler}
 */
const postEnterCodeR6 = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {}, errorSummary = [] }
		} = req;
		const token = req.body['email-code']?.trim();

		// show error page
		if (Object.keys(errors).length > 0) {
			return renderError(errorSummary, errors);
		}

		const isLoginRedirect = Boolean(req.session?.loginRedirect);

		const sessionEmail = getSessionEmail(req.session, false);

		const tokenValid = await isTokenValid(
			token,
			sessionEmail,
			enterCodeConfig.actions.rule6Dashboard
		);

		if (tokenValid.tooManyAttempts) {
			return res.redirect(`/${views.NEED_NEW_CODE}`);
		}

		if (tokenValid.expired) {
			return res.redirect(`/${views.CODE_EXPIRED}`);
		}

		const isRule6User = await isRule6UserByEmail(req, sessionEmail);

		if (!isRule6User || !tokenValid.valid) {
			return renderError('Enter the code we sent to your email address');
		}

		// is valid so set user in session
		await createRule6UserSession(
			req,
			tokenValid.access_token,
			tokenValid.id_token,
			tokenValid.access_token_expiry,
			sessionEmail
		);

		if (isLoginRedirect) {
			deleteSessionEnterCodeAction(req.session);
			return handleCustomRedirect(req, res);
		}

		deleteSessionEnterCodeAction(req.session);
		return res.redirect(`/${views.DASHBOARD}`);

		/**
		 * @param {Array<Object>|string} errorSummary - if just a string will add single error to form and summary
		 * @param {Object} [errors]
		 */
		function renderError(errorSummary, errors = {}) {
			if (typeof errorSummary === 'string') {
				errors = { 'email-code': { msg: errorSummary } };
				errorSummary = [{ text: errorSummary, href: '#email-code' }];
			}

			res.render(views.ENTER_CODE, {
				token,
				errors,
				errorSummary,
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
				confirmEmailLink: `/${views.EMAIL_ADDRESS}`
			});
		}
	};
};

module.exports = {
	getEnterCodeR6,
	postEnterCodeR6
};
