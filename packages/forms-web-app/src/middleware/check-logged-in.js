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
const isLoggedIn = async (req, res, next) => {
	const enrolUsers = await isFeatureActive(FLAG.ENROL_USERS);

	if (!enrolUsers) {
		return next();
	}

	const user = getAppealUserSession(req);

	if (user && user?.id) {
		return next();
	}

	if (requiresCustomRedirect(req.originalUrl)) {
		req.session.loginRedirect = req.originalUrl; // will redirect after enter code

		const appealId = req.params?.appealOrQuestionnaireId;

		if (appealId) {
			// create save/return entry
			const saveAndContinueConfig = await createSaveAndReturn(appealId);

			// remove existing appeal in session
			if (req?.session?.appeal) {
				delete req.session.appeal;
			}

			return res.redirect(`${saveAndContinueConfig.variables.link}`);
		}
	}

	req.session.newOrSavedAppeal = NEW_OR_SAVED_APPEAL_OPTION.RETURN;
	return res.redirect('/appeal/email-address');
};

/**
 * @param {*} appealOrQuestionnaireId
 * @returns
 */
async function createSaveAndReturn(appealOrQuestionnaireId) {
	const tempAppeal = {
		id: appealOrQuestionnaireId,
		skipReturnEmail: true
	};

	await saveAppeal(tempAppeal); //create save/return

	// lookup appeal to get type - don't trust this as user hasn't proven access to appeal via email yet
	const appeal = await getExistingAppeal(appealOrQuestionnaireId);

	if (!appeal || !appeal.appealType) {
		throw new Error('Access denied');
	}

	return appealTypeConfig[appeal.appealType].email.saveAndReturnContinueAppeal(
		appeal,
		'',
		Date.now()
	);
}

/**
 * checks if url belongs to a list of urls that expect the user to navigate directly to them after logging in
 * @param {string} originalUrl
 * @returns {boolean}
 */
function requiresCustomRedirect(originalUrl) {
	const returnToPageList = ['/document/'];
	const isInReturnToPageList = returnToPageList.some((path) => originalUrl.startsWith(path));
	return isInReturnToPageList;
}

module.exports = isLoggedIn;
