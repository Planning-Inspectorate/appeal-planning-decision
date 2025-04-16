const { createRule6UserSession, isRule6UserByEmail } = require('../../services/user.service');
const { isTokenValid } = require('../../lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../lib/logger');

const { getSessionEmail } = require('#lib/session-helper');
const { getAuthClient, createOTPGrant } = require('@pins/common/src/client/auth-client');
const config = require('../../config');
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

		/** @type {string|undefined} */
		const enterCodeId = req.params.enterCodeId;
		if (enterCodeId) {
			req.session.enterCodeId = enterCodeId;
		}

		const action = req.session?.enterCode?.action ?? enterCodeConfig.actions.confirmEmail;

		// show new code success message only once
		const newCode = req.session?.enterCode?.newCode;
		if (newCode) {
			delete req.session?.enterCode?.newCode;
		}

		logger.info({ action }, `getEnterCode`);

		const email = getSessionEmail(req.session, false);

		const isRule6User = await isRule6UserByEmail(req, email);

		if (isRule6User) {
			try {
				const authClient = await getAuthClient(
					config.oauth.baseUrl,
					config.oauth.clientID,
					config.oauth.clientSecret
				);
				await createOTPGrant(authClient, email, action);
			} catch (e) {
				logger.error(e, 'failed to send token to general login user');
			}
		}

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

		const action = req.session?.enterCode?.action ?? enterCodeConfig.actions.confirmEmail;

		const isLoginRedirect = Boolean(req.session?.loginRedirect);

		const sessionEmail = getSessionEmail(req.session, false);

		const tokenValid = await isTokenValid(token, sessionEmail, action);

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

		logger.info(
			{
				action
			},
			`postEnterCode`
		);

		if (isLoginRedirect) {
			deleteTempSessionValues();
			return handleCustomRedirect(req, res);
		}

		deleteTempSessionValues();
		return res.redirect(`/${views.DASHBOARD}`);

		function deleteTempSessionValues() {
			delete req.session.enterCodeId;
			delete req.session?.enterCode?.action;
		}

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
