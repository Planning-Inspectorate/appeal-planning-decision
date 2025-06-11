const { getExistingAppeal } = require('#lib/appeals-api-wrapper');
const { handleCustomRedirect } = require('../../lib/handle-custom-redirect');
const {
	getLPAUser,
	createLPAUserSession,
	getLPAUserStatus,
	setLPAUserStatus,
	logoutUser
} = require('../../services/user.service');
const { createAppealUserSession } = require('../../services/user.service');
const { isTokenValid } = require('#lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const logger = require('#lib/logger');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

const { getSessionEmail, setSessionEmail, getSessionAppealSqlId } = require('#lib/session-helper');
const { getAuthClientConfig, createOTPGrant } = require('@pins/common/src/client/auth-client');
const config = require('../../config');
const {
	typeOfPlanningApplicationToAppealTypeMapper
} = require('#lib/full-appeal/map-planning-application');

/**
 * @typedef {import('#lib/is-token-valid').TokenValidResult} TokenValidResult
 */

/**
 * @typedef {Object} enterCodeOptions
 * @property {boolean} isGeneralLogin - defines if this enter code journey is for a general appeal log in, unrelated to an appeal
 */

/**
 * @param {{EMAIL_ADDRESS: string, ENTER_CODE: string, REQUEST_NEW_CODE: string}} views
 * @param {enterCodeOptions} enterCodeOptions
 * @returns {import('express').Handler}
 */
const getEnterCode = (views, { isGeneralLogin = true }) => {
	return async (req, res) => {
		const {
			body: { errors = {} }
		} = req;

		/** @type {string|undefined} */
		const enterCodeId = req.params.enterCodeId;
		if (enterCodeId) {
			req.session.enterCodeId = enterCodeId;
		}

		const action = req.session?.enterCode?.action ?? enterCodeConfig.actions.saveAndReturn;
		const isReturningFromEmail = action === enterCodeConfig.actions.saveAndReturn;
		const isAppealConfirmation = !isGeneralLogin && !isReturningFromEmail;
		const appealType =
			typeOfPlanningApplicationToAppealTypeMapper[req.session?.appeal?.typeOfPlanningApplication];
		const bannerHtmlOverride =
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType));

		// show new code success message only once
		const newCode = req.session?.enterCode?.newCode;
		if (newCode) {
			delete req.session?.enterCode?.newCode;
		}

		logger.info(
			{ isGeneralLogin, isAppealConfirmation, isReturningFromEmail, action },
			`getEnterCode`
		);

		if (isGeneralLogin) {
			const email = getSessionEmail(req.session, false);

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

			return renderEnterCodePage(`/${views.EMAIL_ADDRESS}`);
		}

		if (isAppealConfirmation) {
			try {
				const email = getSessionEmail(req.session, true);
				await getAuthClientConfig(
					config.oauth.baseUrl,
					config.oauth.clientID,
					config.oauth.clientSecret
				);
				await createOTPGrant(email, action);
			} catch (e) {
				logger.error(e, 'failed to send token for appeal email confirmation');
			}

			return renderEnterCodePage(`/${views.EMAIL_ADDRESS}`);
		}

		if (isReturningFromEmail) {
			logoutUser(req);
			req.session.enterCode = req.session.enterCode || {};
			req.session.enterCode.action = enterCodeConfig.actions.saveAndReturn;

			// lookup user email from appeal id, user hasn't proved they own this appeal/email yet
			const savedAppeal = await getExistingAppeal(enterCodeId);
			setSessionEmail(req.session, savedAppeal.email, false);

			//if middleware UUID validation fails, render the page
			//but do not attempt to send code email to user
			if (Object.keys(errors).length > 0) {
				logger.error(errors, 'failed to send token to returning user');
				return renderEnterCodePage();
			}

			// attempt to send code email to user, render page on failure
			try {
				await getAuthClientConfig(
					config.oauth.baseUrl,
					config.oauth.clientID,
					config.oauth.clientSecret
				);
				await createOTPGrant(savedAppeal.email, action);
			} catch (e) {
				logger.error(e, 'failed to send token to returning user');
			}

			return renderEnterCodePage();
		}

		throw new Error('unhandled journey for GET: enter-code');

		/**
		 * @param {string} [confirmEmailUrl]
		 */
		function renderEnterCodePage(confirmEmailUrl) {
			res.render(views.ENTER_CODE, {
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
				confirmEmailLink: confirmEmailUrl,
				showNewCode: newCode,
				bannerHtmlOverride
			});
		}
	};
};

/**
 * @param {{
 *  NEED_NEW_CODE: string,
 *  CODE_EXPIRED: string,
 *  ENTER_CODE: string,
 *  YOUR_APPEALS: string
 *  APPEAL_ALREADY_SUBMITTED : string
 *  TASK_LIST: string
 *  EMAIL_CONFIRMED: string
 * }} views
 * @param {enterCodeOptions} enterCodeOptions
 * @returns {import('express').Handler}
 */
const postEnterCode = (views, { isGeneralLogin = true }) => {
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

		const action = req.session?.enterCode?.action ?? enterCodeConfig.actions.saveAndReturn;
		const isReturningFromEmail = action === enterCodeConfig.actions.saveAndReturn;
		const isAppealConfirmation = !isGeneralLogin && !isReturningFromEmail;
		const isLoginRedirect = Boolean(req.session?.loginRedirect);

		const sessionEmail = getSessionEmail(req.session, isAppealConfirmation);

		const tokenValid = await isTokenValid(token, sessionEmail, action);
		if (tokenValid.tooManyAttempts) return res.redirect(`/${views.NEED_NEW_CODE}`);
		if (tokenValid.expired) return res.redirect(`/${views.CODE_EXPIRED}`);
		if (!tokenValid.valid) return renderError('Enter the correct code');

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
				isLoginRedirect,
				isGeneralLogin,
				isAppealConfirmation,
				isReturningFromEmail,
				action
			},
			`postEnterCode`
		);

		/** @type {string|undefined} */
		let redirect;

		if (isReturningFromEmail) {
			try {
				req.session.appeal = await getExistingAppeal(enterCodeId);
			} catch (err) {
				return renderError('We did not find your appeal. Enter the correct code');
			}

			redirect =
				req.session.appeal?.state === 'SUBMITTED'
					? `/${views.APPEAL_ALREADY_SUBMITTED}`
					: `/${views.TASK_LIST}`;
		} else if (isAppealConfirmation) {
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
			delete req.session?.enterCodeId;
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

/**
 * The Context for the View to be rendered, with any error information
 * @typedef {Object} ViewContext
 * @property {TokenValidResult} token
 * @property {Array<Object>} errors
 * @property {Object} errorSummary
 */

/**
 * Renders the Error Page for the LPA User who was unsuccessful at logging in
 * @param {string} view The view file to be rendered by Nunjucks
 * @param {ViewContext} context
 */
const renderErrorPageLPA = (res, view, context) => {
	return res.render(view, context);
};

const redirectToEnterLPAEmail = (res, views) => {
	res.redirect(`/${views.YOUR_EMAIL_ADDRESS}`);
};

const redirectToLPADashboard = (res, views) => {
	res.redirect(`/${views.DASHBOARD}`);
};

/**
 * Verifies the token and redirects on failure
 * @param {import('express').Response} res
 * @param {TokenValidResult} token
 * @param {Object} views
 * @returns
 */
const lpaTokenVerification = (res, token, views, id) => {
	if (token.tooManyAttempts) {
		res.redirect(`/${views.NEED_NEW_CODE}/${id}`);
		return false;
	} else if (token.expired) {
		res.redirect(`/${views.CODE_EXPIRED}/${id}`);
		return false;
	} else if (!token.valid) {
		const errorMessage = 'Enter the code';

		renderErrorPageLPA(res, views.ENTER_CODE, {
			lpaUserId: id,
			token,
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
 * Sends a new token to the lpa user referenced by the id in the url params
 * @async
 * @param {import('express').Request} req
 * @returns {Promise<void>}
 */
const sendTokenToLpaUser = async (req) => {
	const user = await getLPAUser(req, req.params.id);

	if (user?.email) {
		await getAuthClientConfig(
			config.oauth.baseUrl,
			config.oauth.clientID,
			config.oauth.clientSecret
		);
		await createOTPGrant(user.email, enterCodeConfig.actions.lpaDashboard);
	}
};

const getEnterCodeLPA = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {} },
			params: { id }
		} = req;

		if (!id) {
			redirectToEnterLPAEmail(res, views);
			return;
		}

		// even if we error, display the enter code page so as to not give anyway any user detail
		try {
			await sendTokenToLpaUser(req);
		} catch (err) {
			logger.error(err);
		}

		// show new code success message only once
		const newCode = req.session?.enterCode?.newCode;

		if (newCode) {
			delete req.session?.enterCode?.newCode;
		}

		if (Object.keys(errors).length > 0) {
			res.render(views.ENTER_CODE, {
				errors: errors,
				errorSummary: [{ text: errors.id.msg, href: '' }],
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`
			});
		} else {
			res.render(views.ENTER_CODE, {
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
				lpaUserId: id,
				showNewCode: newCode
			});
		}
		return;
	};
};

const postEnterCodeLPA = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {}, errorSummary = [] },
			params: { id }
		} = req;

		const emailCode = req.body['email-code']?.trim();

		// if there are errors show error page
		if (Object.keys(errors).length > 0) {
			return renderErrorPageLPA(res, views.ENTER_CODE, {
				lpaUserId: id,
				emailCode,
				errors,
				errorSummary
			});
		}

		const isLoginRedirect = Boolean(req.session?.loginRedirect);

		let user;

		try {
			user = await getLPAUser(req, id);
		} catch (e) {
			logger.error(`Failed to lookup user for id ${id}`);
			logger.error(e);
			const failedToken = {
				valid: false
			};

			return lpaTokenVerification(res, failedToken, views, id);
		}

		// check token
		const tokenResult = await isTokenValid(emailCode, user.email);

		if (!lpaTokenVerification(res, tokenResult, views, id)) return;

		try {
			const currentUserStatus = await getLPAUserStatus(req, id);
			if (currentUserStatus === STATUS_CONSTANTS.ADDED) {
				await setLPAUserStatus(req, id, STATUS_CONSTANTS.CONFIRMED);
			}
			await createLPAUserSession(
				req,
				user,
				tokenResult.access_token,
				tokenResult.id_token,
				tokenResult.access_token_expiry
			);
		} catch (err) {
			logger.error(err, `Failed to create user session for user id ${id}`);
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
