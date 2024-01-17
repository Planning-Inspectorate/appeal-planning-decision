const { getAppealUserSession } = require('../services/appeal-user.service');
const { isFeatureActive } = require('../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	constants: { NEW_OR_SAVED_APPEAL_OPTION }
} = require('@pins/business-rules');

const { saveAppeal, getExistingAppeal } = require('../lib/appeals-api-wrapper');
const {
	config: {
		appeal: { type: appealTypeConfig }
	}
} = require('@pins/business-rules');

/**
 * @type {import('express').RequestHandler}
 */
const checkLoggedIn = async (req, res, next) => {
	const enrolUsers = await isFeatureActive(FLAG.ENROL_USERS);

	if (!enrolUsers) {
		return next();
	}

	const user = getAppealUserSession(req);

	if (user && user?.id) {
		return next();
	}

	// document url - email sent to users with link to download
	if (req.originalUrl.startsWith('/document/') && req.params?.appealOrQuestionnaireId) {
		return await handleSaveAndReturnRedirect(req.params.appealOrQuestionnaireId);
	}

	req.session.newOrSavedAppeal = NEW_OR_SAVED_APPEAL_OPTION.RETURN;
	return res.redirect('/appeal/email-address');

	/**
	 * @param {string} appealId
	 * @returns {Promise<void>}
	 */
	async function handleSaveAndReturnRedirect(appealId) {
		if (req?.session?.appeal) {
			delete req.session.appeal;
		}
		req.session.loginRedirect = req.originalUrl;
		return res.redirect(await createSaveAndReturnUrl(appealId));
	}
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
