const { getUserFromSession } = require('../services/user.service');

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

	let loginPage = '/appeal/email-address'; // appellant
	if (req.originalUrl.startsWith('/rule-6/')) loginPage = '/rule-6/email-address'; // rule6
	else if (req.originalUrl.startsWith('/document/') && req.params?.appealOrQuestionnaireId) {
		loginPage = await createSaveAndReturnUrl(req.params?.appealOrQuestionnaireId); // document
	}

	req.session.regenerate((err) => {
		if (err) {
			req.session = {};
		}

		req.session.loginRedirect = req.originalUrl;

		return res.redirect(loginPage);
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
