const { getUserFromSession } = require('../services/user.service');
const { storeAppealPageRedirect } = require('../lib/login-redirect');
const {
	constants: { NEW_OR_SAVED_APPEAL_OPTION }
} = require('@pins/business-rules');

const { saveAppeal, getExistingAppeal } = require('../lib/appeals-api-wrapper');
const {
	config: {
		appeal: { type: appealTypeConfig }
	}
} = require('@pins/business-rules');

const {
	server: { sessionIdleTimeoutAppellant, sessionIdleTimeoutDelay }
} = require('../config');
const isIdle = require('../lib/check-session-idle');

/**
 * @type {import('express').RequestHandler}
 */
const checkLoggedIn = async (req, res, next) => {
	const user = getUserFromSession(req);

	if (
		user &&
		user?.expiry.getTime() > Date.now() &&
		!isIdle(req, sessionIdleTimeoutAppellant, sessionIdleTimeoutDelay)
	) {
		return next();
	}

	let docRedirectUrl;
	let v2docRedirect;
	let requestedPageRedirect;

	if (req.originalUrl.startsWith('/document/') && req.params?.appealOrQuestionnaireId) {
		docRedirectUrl = await createSaveAndReturnUrl(req.params?.appealOrQuestionnaireId);
	}

	if (
		req.originalUrl.startsWith('/appeal-document/') &&
		(req.params?.appealOrQuestionnaireId || req.params?.appellantSubmissionId)
	) {
		v2docRedirect = req.originalUrl;
	}

	if (req.originalUrl.startsWith('/lpa-questionnaire-document/') && req.params?.caseReference) {
		v2docRedirect = req.originalUrl;
	}

	if (req.originalUrl.startsWith('/appeals/')) {
		requestedPageRedirect = req.originalUrl;
	}

	// reset session
	req.session.regenerate((err) => {
		if (err) {
			req.session = {};
		}

		if (docRedirectUrl) {
			req.session.loginRedirect = req.originalUrl;
			return res.redirect(docRedirectUrl);
		}

		if (v2docRedirect) {
			req.session.loginRedirect = req.originalUrl;
		}

		if (req.originalUrl.startsWith('/rule-6/')) {
			return res.redirect('email-address');
		}

		if (req.originalUrl.startsWith('/lpa-questionnaire-document/')) {
			return res.redirect('/manage-appeals/your-email-address');
		}

		if (requestedPageRedirect) {
			storeAppealPageRedirect('appeals')(req, res);
		}

		req.session.newOrSavedAppeal = NEW_OR_SAVED_APPEAL_OPTION.RETURN;
		return res.redirect('/appeal/email-address');
	});
};

/**
 * @param {string} appealId
 * @returns {Promise<string>}
 */
async function createSaveAndReturnUrl(appealId) {
	const tempAppeal = {
		id: appealId,
		skipReturnEmail: true
	};

	await saveAppeal(tempAppeal); //create save/return

	// lookup appeal to get type - don't trust this as user hasn't proven access to appeal via email yet
	const appeal = await getExistingAppeal(appealId);

	if (!appeal || !appeal.appealType) {
		throw new Error('Access denied');
	}

	const saveAndReturn = appealTypeConfig[appeal.appealType].email.saveAndReturnContinueAppeal(
		appeal,
		'',
		Date.now()
	);

	return saveAndReturn.variables.link;
}

module.exports = checkLoggedIn;
