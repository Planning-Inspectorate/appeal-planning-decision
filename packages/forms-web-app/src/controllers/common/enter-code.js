const {
	getSavedAppeal,
	getExistingAppeal,
	sendToken,
	getUserById
} = require('../../lib/appeals-api-wrapper');
const {
	getLPAUser,
	createLPAUserSession,
	getLPAUserStatus,
	setLPAUserStatus
} = require('../../services/lpa-user.service');
const { createAppealUserSession } = require('../../services/appeal-user.service');
const {
	isTokenValid,
	isTestToken,
	isTestEnvironment,
	isTestLpaAndToken
} = require('../../lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../../src/lib/logger');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const { apiClient } = require('#lib/appeals-api-client');
const {
	getSessionEmail,
	setSessionEmail,
	getSessionAppealSqlId
} = require('../../lib/session-helper');

/**
 * @typedef {Object} Token
 * @property {string} id
 * @property {string} token
 * @property {boolean} tooManyAttempts
 * @property {boolean} expired
 * @property {boolean} valid
 * @property {"confirmEmail" | "saveAndReturn" | "lpa-dashboard"} action
 * @property {number} attempts The number of attempted and failed logins
 * @property {Number} createdAt Epoch time
 *
 */

/**
 * The Context for the View to be rendered, with any error information
 * @typedef {Object} ViewContext
 * @property {Token} token
 * @property {Array} errors
 * @property {string} errorSummary
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
 * @param {ExpressResponse} res
 * @param {Token} token
 * @param {Object} views
 * @returns
 */
const tokenVerification = (res, token, views, id) => {
	if (token.tooManyAttempts) {
		res.redirect(`/${views.NEED_NEW_CODE}/${id}`);
		return false;
	} else if (token.expired) {
		res.redirect(`/${views.CODE_EXPIRED}/${id}`);
		return false;
	} else if (!token.valid) {
		renderErrorPageLPA(res, views.ENTER_CODE, {
			lpaUserId: id,
			token,
			errors: {},
			errorSummary: [{ text: 'Enter a correct code', href: '#email-code' }]
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
 * @param {ExpressRequest} req
 * @returns {Promise<void>}
 */
async function sendTokenToLpaUser(req) {
	const user = await getUserById(req.params.id);

	if (user?.email) {
		await sendToken(req.params.id, enterCodeConfig.actions.lpaDashboard, user.email);
	}
}

/**
 * @param {{EMAIL_ADDRESS: string, ENTER_CODE: string, REQUEST_NEW_CODE: string}} views
 * @param {boolean} [isGeneralLogin]
 * @returns {import('express').Handler}
 */
const getEnterCode = (views, isGeneralLogin) => {
	return async (req, res) => {
		const {
			body: { errors = {} }
		} = req;

		// flag on/off:
		// save/return
		// general login
		// confirm email for appeal
		// pdf works

		const action = req.session?.enterCode?.action ?? enterCodeConfig.actions.saveAndReturn;
		const isReturningFromEmail = action === enterCodeConfig.actions.saveAndReturn;
		const isAppealConfirmation = !isGeneralLogin && !isReturningFromEmail;

		/** @type {string|undefined} */
		const appealId = req.params.id;

		// show new code success message only once
		const newCode = req.session?.enterCode?.newCode;
		if (newCode) {
			delete req.session?.enterCode?.newCode;
		}

		if (isGeneralLogin) {
			const email = getSessionEmail(req.session, false);

			try {
				await sendToken(undefined, action, email);
			} catch (e) {
				logger.error(e, 'failed to send token to general login user');
			}

			return renderEnterCodePage(`/${views.EMAIL_ADDRESS}`);
		}

		if (isAppealConfirmation) {
			try {
				await sendToken(appealId, action);
			} catch (e) {
				logger.error(e, 'failed to send token for appeal email confirmation');
			}

			return renderEnterCodePage(`/${views.EMAIL_ADDRESS}`);
		}

		if (isReturningFromEmail) {
			req.session.enterCode = req.session.enterCode || {};
			req.session.enterCode.action = enterCodeConfig.actions.saveAndReturn;
			req.session.userTokenId = appealId; // appeal id not user id?

			// lookup user email from appeal id, user hasn't proved they own this appeal/email yet
			const savedAppeal = await getExistingAppeal(req.params.id);
			setSessionEmail(req.session, savedAppeal.email, false);

			//if middleware UUID validation fails, render the page
			//but do not attempt to send code email to user
			if (Object.keys(errors).length > 0) {
				return renderEnterCodePage();
			}

			// attempt to send code email to user, render page on failure
			try {
				await sendToken(req.params.id, action);
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
				showNewCode: newCode
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
 * @param {boolean} [isGeneralLogin]
 * @returns {import('express').Handler}
 */
const postEnterCode = (views, isGeneralLogin) => {
	return async (req, res) => {
		const {
			body: { errors = {}, errorSummary = [] },
			params: { id }
		} = req;
		const token = req.body['email-code'];

		// show error page
		if (Object.keys(errors).length > 0) {
			return renderError(errorSummary);
		}

		const action = req.session?.enterCode?.action ?? enterCodeConfig.actions.saveAndReturn;
		const isReturningFromEmail = action === enterCodeConfig.actions.saveAndReturn;
		const isAppealConfirmation = !isGeneralLogin && !isReturningFromEmail;

		const enrolUsersFlag = await isFeatureActive(FLAG.ENROL_USERS);

		const sessionEmail = getSessionEmail(req.session, isAppealConfirmation);

		const isTestScenario = isTestEnvironment() && isTestToken(token);

		const tokenValid = await isTokenValid(id, token, sessionEmail, req.session, isTestScenario);

		if (tokenValid.tooManyAttempts) {
			return res.redirect(`/${views.NEED_NEW_CODE}`);
		}

		if (tokenValid.expired) {
			return res.redirect(`/${views.CODE_EXPIRED}`);
		}

		if (!tokenValid.valid) {
			const customErrorSummary = [{ text: 'Enter a correct code', href: '#email-code' }];
			return renderError(customErrorSummary);
		}

		if (enrolUsersFlag) {
			// is valid so set user in session
			const user = await apiClient.getUserByEmailV2(sessionEmail);
			createAppealUserSession(req, user);
		}

		if (isGeneralLogin) {
			deleteTempSessionValues();
			return res.redirect(`/${views.YOUR_APPEALS}`);
		}

		if (isAppealConfirmation) {
			if (enrolUsersFlag) {
				await apiClient.linkUserToV2Appeal(sessionEmail, getSessionAppealSqlId(req.session));
			}

			deleteTempSessionValues();

			if (req.session.loginRedirect) {
				return handleCustomRedirect();
			} else {
				return res.redirect(`/${views.EMAIL_CONFIRMED}`);
			}
		}

		if (isReturningFromEmail) {
			try {
				const savedAppeal = await getSavedAppeal(id);
				req.session.appeal = await getExistingAppeal(savedAppeal.appealId);
			} catch (err) {
				const customErrorSummary = [
					{ text: 'We did not find your appeal. Enter the correct code', href: '#email-code' }
				];
				return renderError(customErrorSummary);
			}

			deleteTempSessionValues();

			// redirect
			if (req.session.loginRedirect) {
				return handleCustomRedirect();
			} else if (req.session.appeal.state === 'SUBMITTED') {
				return res.redirect(`/${views.APPEAL_ALREADY_SUBMITTED}`);
			} else {
				return res.redirect(`/${views.TASK_LIST}`);
			}
		}

		throw new Error('unhandled journey for POST: enter-code');

		function deleteTempSessionValues() {
			delete req.session.userTokenId;
			delete req.session?.enterCode?.action;
		}

		function renderError(errorSummary) {
			res.render(views.ENTER_CODE, {
				token,
				errors: {},
				errorSummary: errorSummary
			});
		}

		function handleCustomRedirect() {
			const redirect = req.session.loginRedirect;
			delete req.session.loginRedirect;
			res.redirect(redirect);
		}
	};
};

const getEnterCodeLPA = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {} },
			params: { id }
		} = req;

		if (!id || !id.match(/^[a-f\d]{24}$/i)) {
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

		const emailCode = req.body['email-code'];

		// if there are errors show error page
		if (Object.keys(errors).length > 0) {
			return renderErrorPageLPA(res, views.ENTER_CODE, {
				lpaUserId: id,
				emailCode,
				errors,
				errorSummary
			});
		}

		let user;

		try {
			user = await getLPAUser(id);
		} catch (e) {
			logger.error(`Failed to lookup user for id ${id}`);
			logger.error(e);
			const failedToken = {
				valid: false
			};

			return tokenVerification(res, failedToken, views, id);
		}

		if (isTestEnvironment() && isTestLpaAndToken(emailCode, user.lpaCode)) {
			try {
				await createLPAUserSession(req, user);
				redirectToLPADashboard(res, views);
				return;
			} catch (e) {
				logger.error(`Failed to create user session for user id ${id}`);
				logger.error(e);
				return {
					valid: false,
					action: enterCodeConfig.actions.lpaDashboard
				};
			}
		}

		// check token
		let token = await isTokenValid(id, emailCode, user.email);

		if (!tokenVerification(res, token, views, id)) return;

		try {
			const currentUserStatus = await getLPAUserStatus(id);
			if (currentUserStatus === STATUS_CONSTANTS.ADDED) {
				await setLPAUserStatus(id, STATUS_CONSTANTS.CONFIRMED);
			}
			await createLPAUserSession(req, user);
		} catch (e) {
			logger.error(`Failed to create user session for user id ${id}`);
			logger.error(e);
			throw new Error('Failed to create user session');
		}

		redirectToLPADashboard(res, views);
		return;
	};
};

module.exports = {
	getEnterCode,
	postEnterCode,
	getEnterCodeLPA,
	postEnterCodeLPA
};
