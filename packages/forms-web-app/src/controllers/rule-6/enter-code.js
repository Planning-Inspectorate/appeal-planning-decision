const { createAppealUserSession } = require('../../services/user.service');
const { isTokenValid } = require('../../lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../lib/logger');

const { getSessionEmail } = require('#lib/session-helper');
const getAuthClient = require('@pins/common/src/client/auth-client');
const config = require('../../config');
const { AUTH } = require('@pins/common/src/constants');

/**
 * @typedef {import('#lib/is-token-valid').TokenValidResult} TokenValidResult
 */

/**
 * @typedef {Object} enterCodeOptions
 * @property {boolean} isGeneralLogin - defines if this enter code journey is for a general appeal log in, unrelated to an appeal
 */

/**
 * Creates a one time password grant via the auth server
 * @param {string} email
 * @param {string} action
 * @returns {Promise<void>}
 */
const createOTPGrant = async (email, action) => {
	const client = await getAuthClient(
		config.oauth.baseUrl,
		config.oauth.clientID,
		config.oauth.clientSecret
	);

	await client.grant({
		grant_type: AUTH.GRANT_TYPE.OTP,
		email: email,
		action: action,
		resource: AUTH.RESOURCE
	});
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
const getEnterCodeR6 = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {} }
		} = req;

		if (Object.keys(errors).length > 0) {
			logger.error(errors, 'failed to send token to returning user');
			return renderEnterCodePage();
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

		try {
			await createOTPGrant(email, action);
		} catch (e) {
			logger.error(e, 'failed to send token to general login user');
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
			body: { errors = {}, errorSummary = [] },
			params: { enterCodeId }
		} = req;
		const token = req.body['email-code']?.trim();

		// show error page
		if (Object.keys(errors).length > 0) {
			return renderError(errorSummary, errors);
		}

		const action = req.session?.enterCode?.action ?? enterCodeConfig.actions.confirmEmail;

		const sessionEmail = getSessionEmail(req.session, false);

		const tokenValid = await isTokenValid(
			token,
			enterCodeId,
			sessionEmail,
			action,
			req.session?.appeal?.lpaCode,
			true
		);

		if (tokenValid.tooManyAttempts) {
			return res.redirect(`/${views.NEED_NEW_CODE}`);
		}

		if (tokenValid.expired) {
			return res.redirect(`/${views.CODE_EXPIRED}`);
		}

		if (!tokenValid.valid) {
			return renderError('Enter the correct code');
		}

		// is valid so set user in session
		createAppealUserSession(
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
				errorSummary
			});
		}
	};
};

module.exports = {
	getEnterCodeR6,
	postEnterCodeR6
};
