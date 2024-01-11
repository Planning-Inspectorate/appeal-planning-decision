const { getAppealUserSession } = require('../services/appeal-user.service');
const { isFeatureActive } = require('../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	constants: { NEW_OR_SAVED_APPEAL_OPTION }
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

	const pathRequiresCustomRedirect = requiresCustomRedirect(req.originalUrl);

	req.session.newOrSavedAppeal = NEW_OR_SAVED_APPEAL_OPTION.RETURN;

	if (pathRequiresCustomRedirect) {
		req.session.loginRedirect = req.originalUrl; // will redirect after enter code
	}

	return res.redirect('/appeal/email-address');
};

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
