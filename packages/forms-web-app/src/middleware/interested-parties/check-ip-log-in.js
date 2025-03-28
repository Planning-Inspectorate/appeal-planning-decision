const { getUserFromSession, logoutUser } = require('../../services/user.service');
const {
	server: { sessionIdleTimeoutAppellant, sessionIdleTimeoutDelay },
	appeals: { url, timeout }
} = require('../../config');
const isIdle = require('../../lib/check-session-idle');
const { AppealsApiClient } = require('@pins/common/src/client/appeals-api-client');
const { getClientCredentials } = require('../create-api-clients');

/**
 * @type {import('express').Handler}
 */
const checkInterestedPartyLogInNotExpired = async (req, res, next) => {
	const user = getUserFromSession(req);

	//if no user or user log in has not expired then move on to next action
	if (
		!user ||
		(user?.expiry.getTime() > Date.now() &&
			!isIdle(req, sessionIdleTimeoutAppellant, sessionIdleTimeoutDelay))
	) {
		return next();
	}

	//wipe user with expired login details from session
	logoutUser(req);

	/** @type {import('@pins/common/src/client/appeals-api-client').AuthTokens} */
	const auth = {
		access_token: undefined,
		id_token: undefined,
		client_creds: await getClientCredentials()
	};

	req.appealsApiClient = new AppealsApiClient(url, auth, timeout);

	next();
};

module.exports = checkInterestedPartyLogInNotExpired;
