const {
	getSavedAppeal,
	getExistingAppeal,
	sendToken,
	getUserById
} = require('../../lib/appeals-api-wrapper');
const {
	isTokenValid,
	isTestLPACheckTokenAndSession,
	isTestEnvironment
} = require('../../lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const logger = require('../../../src/lib/logger');

/**
 * @typedef {Object} Token
 * @property {string} id
 * @property {string} token
 * @property {"confirmEmail" | "saveAndReturn" | "lpa-dashboard"} action
 * @property {number} attempts The number of attempted and failed logins
 * @property {Number} createdAt Epoch time
 *
 */

/**
 * The id of the user, in mongodb object id format
 * @typedef {/^[a-f\\d]{24}$/i} UserId
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

		// check token
		let tokenValid = await isTokenValid(id, token, req.session);

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

		// if handling an email confirmation
		// session will be in browser so can redirect here and consider email confirmed
		if (tokenValid.action === enterCodeConfig.actions.confirmEmail) {
			delete req.session?.enterCode?.action;
			return res.redirect(`/${views.EMAIL_CONFIRMED}`);
		}

		// n.b. older save and return objects in db may not have an action - May 2023

		// delete user session
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
		if (req.session.appeal.state === 'SUBMITTED') {
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
		if (Object.keys(errors).length > 0) {
			res.render(views.ENTER_CODE, {
				errors: errors,
				errorSummary: [{ text: errors.id.msg, href: '' }],
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`
			});
		} else {
			res.render(views.ENTER_CODE, {
				requestNewCodeLink: `/${views.REQUEST_NEW_CODE}`,
				lpaUserId: id
			});
		}
		return;
	};
};

/**
 * Creates the user object within the session object of the request for the successfully logged in LPAUser
 * @param {ExpressRequest} req
 * @param {UserId} userId
 */
const createLPAUserSession = async (req, userId) => {
	let user = await getUserById(userId);
	req.session.lpaUser = user;
	req.session.save((err) => {
		logger.error('Error storing LPA User Session');
		logger.error(err);
	});
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

		if (isTestEnvironment() && isTestLPACheckTokenAndSession(emailCode, req.session)) {
			try {
				createLPAUserSession(req, id);
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
		let token = await isTokenValid(id, emailCode);

		if (!tokenVerification(res, token, views, id)) return;

		try {
			createLPAUserSession(req, id);
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
