const { handleCustomRedirect } = require('../../lib/handle-custom-redirect');
const {
	getLPAUser,
	createLPAUserSession,
	getLPAUserStatus,
	setLPAUserStatus
} = require('../../services/user.service');
const { createAppealUserSession } = require('../../services/user.service');
const { isTokenValid } = require('#lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const logger = require('#lib/logger');
const { STATUS_CONSTANTS, AUTH } = require('@pins/common/src/constants');

const {
	getSessionEmail,
	getSessionAppealSqlId,
	getSessionEnterCodeAction,
	deleteSessionEnterCodeAction,
	getSessionNewCode,
	deleteSessionNewCode
} = require('#lib/session-helper');
const config = require('../../config');
const { caseTypeLookup } = require('@pins/common/src/database/data-static');

/**
 * @typedef {import('#lib/is-token-valid').TokenValidResult} TokenValidResult
 */

/**
 * @typedef {Object} enterCodeOptions
 * @property {boolean} isGeneralLogin - defines if this enter code journey is for a general appeal log in, unrelated to an appeal
 */

/**
 * @param {{EMAIL_ADDRESS: string, ENTER_CODE: string, REQUEST_NEW_CODE: string}} views
 * @returns {import('express').Handler}
 */
const getEnterCode = (views) => {
	return async (req, res) => {
		const appealType = caseTypeLookup(req.session?.appeal?.appealType, 'id')?.processCode;
		const bannerHtmlOverride =
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType));

		// show new code success message only once
		const newCode = req.session?.enterCode?.newCode;
		if (newCode) {
			delete req.session?.enterCode?.newCode;
		}

		res.render(views.ENTER_CODE, {
			requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
			confirmEmailLink: `/${views.EMAIL_ADDRESS}`,
			showNewCode: newCode,
			bannerHtmlOverride
		});
	};
};

/**
 * @param {{
 *  NEED_NEW_CODE: string,
 *  CODE_EXPIRED: string,
 *  ENTER_CODE: string,
 *  YOUR_APPEALS: string,
 *  EMAIL_CONFIRMED: string,
 *  REQUEST_NEW_CODE: string,
 * 	EMAIL_ADDRESS: string
 * }} views
 * @param {enterCodeOptions} enterCodeOptions
 * @returns {import('express').Handler}
 */
const postEnterCode = (views, { isGeneralLogin = true }) => {
	return async (req, res) => {
		const {
			body: { errors = {}, errorSummary = [] }
		} = req;
		const token = req.body['email-code']?.trim();

		// show error page
		if (Object.keys(errors).length > 0) {
			return renderError(errorSummary, errors);
		}

		const action = getSessionEnterCodeAction(req.session) ?? enterCodeConfig.actions.saveAndReturn;
		const isAppealConfirmation = !isGeneralLogin;
		const isLoginRedirect = Boolean(req.session?.loginRedirect);

		const sessionEmail = getSessionEmail(req.session, isAppealConfirmation);

		const tokenValid = await isTokenValid(token, sessionEmail, action);
		if (tokenValid.tooManyAttempts) return res.redirect(`/${views.NEED_NEW_CODE}`);
		if (tokenValid.expired) return res.redirect(`/${views.CODE_EXPIRED}`);
		if (!tokenValid.valid) return renderError('Enter the code we sent to your email address');

		// is valid so set user in session
		createAppealUserSession(
			req,
			tokenValid.access_token,
			tokenValid.id_token,
			tokenValid.access_token_expiry,
			sessionEmail
		);

		logger.debug(
			{
				isLoginRedirect,
				isGeneralLogin,
				isAppealConfirmation,
				action
			},
			`postEnterCode`
		);

		/** @type {string|undefined} */
		let redirect;

		if (isAppealConfirmation) {
			await req.appealsApiClient.linkUserToV2Appeal(
				sessionEmail,
				getSessionAppealSqlId(req.session)
			);
			redirect = `/${views.EMAIL_CONFIRMED}`;
		} else if (isGeneralLogin) {
			redirect = `/${views.YOUR_APPEALS}`;
		} else {
			throw new Error('unhandled journey for POST: enter-code');
		}

		deleteTempSessionValues();

		// use login redirect
		if (isLoginRedirect) {
			return handleCustomRedirect(req, res);
		}

		return res.redirect(redirect);

		function deleteTempSessionValues() {
			deleteSessionEnterCodeAction(req.session);
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
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
				confirmEmailLink: `/${views.EMAIL_ADDRESS}`,
				token,
				errors,
				errorSummary
			});
		}
	};
};

/**
 * The Context for the View to be rendered, with any error information
 * @typedef {Object} ViewContext
 * @property {string} requestNewCodeLink
 * @property {boolean} [showNewCode]
 * @property {Array<Object>} [errors]
 * @property {Object} [errorSummary]
 */

/**
 * @typedef {Object} LPAViews
 * @property {string} ENTER_CODE
 * @property {string} CODE_EXPIRED
 * @property {string} NEED_NEW_CODE
 * @property {string} REQUEST_NEW_CODE
 * @property {string} DASHBOARD
 * @property {string} YOUR_EMAIL_ADDRESS
 */

/**
 * Renders enter code page for LPA
 * @param {import('express').Response} res
 * @param {string} view
 * @param {ViewContext} context
 */
const renderEnterCodePageLPA = (res, view, context) => {
	return res.render(view, context);
};

/**
 * @param {import('express').Response} res
 * @param {LPAViews} views
 */
const redirectToLPADashboard = (res, views) => {
	res.redirect(`/${views.DASHBOARD}`);
};

/**
 * Verifies the token and redirects on failure
 * @param {import('express').Response} res
 * @param {TokenValidResult} token
 * @param {LPAViews} views
 * @returns {boolean}
 */
const lpaTokenVerification = (res, token, views) => {
	if (token.tooManyAttempts) {
		res.redirect(`/${views.NEED_NEW_CODE}`);
		return false;
	} else if (token.expired) {
		res.redirect(`/${views.CODE_EXPIRED}`);
		return false;
	} else if (!token.valid) {
		const errorMessage = 'Enter the code we sent to your email address';

		renderEnterCodePageLPA(res, views.ENTER_CODE, {
			requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
			errors: { 'email-code': { msg: errorMessage } },
			errorSummary: [{ text: errorMessage, href: '#email-code' }]
		});
		return false;
	} else if (token.valid) {
		return true;
	}
	return false;
};

/**
 * @param {LPAViews} views
 */
const getEnterCodeLPA = (views) => {
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @returns {Promise<void>}
	 */
	return async (req, res) => {
		const {
			body: { errors = {} }
		} = req;

		// show new code success message only once
		const newCode = getSessionNewCode(req.session);
		if (newCode) {
			deleteSessionNewCode(req.session);
		}

		if (Object.keys(errors).length > 0) {
			return renderEnterCodePageLPA(res, views.ENTER_CODE, {
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
				errors: errors,
				errorSummary: [{ text: errors.id.msg, href: '' }]
			});
		}

		renderEnterCodePageLPA(res, views.ENTER_CODE, {
			showNewCode: newCode,
			requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`
		});
	};
};

/**
 * @param {LPAViews} views
 */
const postEnterCodeLPA = (views) => {
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @returns {Promise<void>}
	 */
	return async (req, res) => {
		const {
			body: { errors = {}, errorSummary = [] }
		} = req;

		const emailCode = req.body['email-code']?.trim();
		const email = getSessionEmail(req.session, false);

		// if there are errors show error page
		if (Object.keys(errors).length > 0) {
			return renderEnterCodePageLPA(res, views.ENTER_CODE, {
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
				errors,
				errorSummary
			});
		}

		const isLoginRedirect = Boolean(req.session?.loginRedirect);

		let user;

		try {
			user = await getLPAUser(req, email);
		} catch (e) {
			logger.error(`Failed to lookup user for email ${email}`);
			logger.error(e);

			const errorMessage = 'Enter the code we sent to your email address';
			return renderEnterCodePageLPA(res, views.ENTER_CODE, {
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
				errors: { 'email-code': { msg: errorMessage } },
				errorSummary: [{ text: errorMessage, href: '#email-code' }]
			});
		}

		// check token
		const tokenResult = await isTokenValid(emailCode, user.email, undefined, [
			AUTH.SCOPES.USER_DETAILS.LPA
		]);

		if (!lpaTokenVerification(res, tokenResult, views)) return;

		try {
			const currentUserStatus = await getLPAUserStatus(req, email);
			if (currentUserStatus === STATUS_CONSTANTS.ADDED) {
				await setLPAUserStatus(req, email, STATUS_CONSTANTS.CONFIRMED);
			}
			await createLPAUserSession(
				req,
				user,
				tokenResult.access_token,
				tokenResult.id_token,
				tokenResult.access_token_expiry
			);
		} catch (err) {
			logger.error(err, `Failed to create lpa user session for user ${email}`);
			throw err;
		}

		if (isLoginRedirect) {
			return handleCustomRedirect(req, res);
		}

		return redirectToLPADashboard(res, views);
	};
};

module.exports = {
	getEnterCode,
	postEnterCode,
	getEnterCodeLPA,
	postEnterCodeLPA
};
