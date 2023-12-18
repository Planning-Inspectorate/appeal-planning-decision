const {
	getSavedAppeal,
	getExistingAppeal,
	sendToken,
	getUserById,
	linkUserToV2Appeal,
	getUserByEmailV2
} = require('../../lib/appeals-api-wrapper');
const {
	getLPAUser,
	createLPAUserSession,
	getLPAUserStatus,
	setLPAUserStatus
} = require('../../services/lpa-user.service');
const { isTokenValid, isTestLpaAndToken, isTestEnvironment } = require('../../lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../../src/lib/logger');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');

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
	console.log(views);
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

const getEnterCode = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {} }
		} = req;

		const action = req.session?.enterCode?.action ?? enterCodeConfig.actions.saveAndReturn;

		if (action === enterCodeConfig.actions.saveAndReturn) {
			req.session.enterCode = req.session.enterCode || {};
			req.session.enterCode.action = enterCodeConfig.actions.saveAndReturn;
		}

		// show new code success message only once
		const newCode = req.session?.enterCode?.newCode;
		if (newCode) {
			delete req.session?.enterCode?.newCode;
		}

		const url = `/${views.REQUEST_NEW_CODE}`;
		const confirmEmailUrl =
			action === enterCodeConfig.actions.confirmEmail ? `/${views.EMAIL_ADDRESS}` : null;

		//this handles old save & return url (without id params)
		if (req.session.appeal?.id && !req.params.id) {
			res.redirect(`/${views.ENTER_CODE}/${req.session.appeal.id}`);
			return;
		}

		//this handles new save & return url (with id params)
		if (req.params.id) {
			req.session.userTokenId = req.params.id;

			//if middleware UUID validation fails, render the page
			//but do not attempt to send code email to user
			if (Object.keys(errors).length > 0) {
				return renderEnterCodePage();
			}

			//attempt to send code email to user
			//and render page if API response errors
			try {
				await sendToken(req.params.id, action);
			} catch (e) {
				return renderEnterCodePage();
			}
		}

		return renderEnterCodePage();

		function renderEnterCodePage() {
			res.render(views.ENTER_CODE, {
				requestNewCodeLink: url,
				confirmEmailLink: confirmEmailUrl,
				showNewCode: newCode
			});
		}
	};
};

const postEnterCode = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {}, errorSummary = [] },
			params: { id }
		} = req;
		const token = req.body['email-code'];

		// show error page
		if (Object.keys(errors).length > 0) {
			return res.render(views.ENTER_CODE, {
				token,
				errors,
				errorSummary
			});
		}

		let tokenValidResult = async () => {
			if (isTestEnvironment() && isTestLpaAndToken(token, req.session?.appeal?.lpaCode)) {
				return {
					valid: true,
					action: enterCodeConfig.actions.confirmEmail
				};
			} else {
				return await isTokenValid(id, token, null, req.session);
			}
		};

		// check token
		let tokenValid = await tokenValidResult();

		if (tokenValid.tooManyAttempts) {
			return res.redirect(`/${views.NEED_NEW_CODE}`);
		}

		if (tokenValid.expired) {
			return res.redirect(`/${views.CODE_EXPIRED}`);
		}

		if (!tokenValid.valid) {
			const customErrorSummary = [{ text: 'Enter a correct code', href: '#email-code' }];

			return res.render(views.ENTER_CODE, {
				token,
				errors: {},
				errorSummary: customErrorSummary
			});
		}

		const enrolUsersFlag = await isFeatureActive(FLAG.ENROL_USERS);
		let user;

		// get user and set session
		if (enrolUsersFlag) {
			user = await getUserByEmailV2(req.session.appeal.email);

			if (!user) {
				throw new Error('user not found after entering code');
			}
		}

		// if handling an email confirmation
		// session will be in browser so can redirect here and consider email confirmed
		if (tokenValid.action === enterCodeConfig.actions.confirmEmail) {
			if (enrolUsersFlag && user) {
				await linkUserToV2Appeal(user.email, req.session.appeal.appealSqlId);
			}

			delete req.session?.enterCode?.action;
			return res.redirect(`/${views.EMAIL_CONFIRMED}`);
		}

		// n.b. older save and return objects in db may not have an action - May 2023

		// delete temp user token from session
		delete req.session.userTokenId;

		// look up appeal from db
		let savedAppeal;
		try {
			savedAppeal = await getSavedAppeal(id);
		} catch (err) {
			return res.render(views.ENTER_CODE, {
				errors,
				errorSummary: [
					{ text: 'We did not find your appeal. Enter the correct code', href: '#email-code' }
				]
			});
		}

		req.session.appeal = await getExistingAppeal(savedAppeal.appealId);

		// redirect
		if (req.session.loginRedirect) {
			// before appeal.state check in case this is an attempt to download the appeal pdf
			const redirect = req.session.loginRedirect;
			delete req.session.loginRedirect;
			res.redirect(redirect);
			return;
		} else if (req.session.appeal.state === 'SUBMITTED') {
			return res.redirect(`/${views.APPEAL_ALREADY_SUBMITTED}`);
		} else {
			return res.redirect(`/${views.TASK_LIST}`);
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
