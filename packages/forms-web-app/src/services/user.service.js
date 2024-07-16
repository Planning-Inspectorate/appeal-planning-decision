const { getLPA } = require('../lib/appeals-api-wrapper');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

/**
 * @typedef {Object} AppealUserSession
 * @property {string} access_token
 * @property {string} id_token
 * @property {Date} expiry
 * @property {string} email
 *
 *
 * @typedef {Object} LpaUserAdditions
 * @property {string} lpaName - Name of the lpa the user belongs to.
 * @property {string} lpaDomain - Domain of the lpa the user belongs to.
 *
 * @typedef {import('appeals-service-api').Api.AppealUser & LpaUserAdditions} LPAUser
 */

/**
 * Adds appealUser to session req.session.user
 * @param {import('express').Request} req
 * @param {string} access_token
 * @param {string} id_token
 * @param {Date} expiry
 * @param {string} email
 * @returns {void}
 */
const createAppealUserSession = (req, access_token, id_token, expiry, email) => {
	req.session.user = {
		access_token: access_token,
		id_token: id_token,
		expiry: expiry,
		email
	};
};

/**
 * Creates the user object within the session object of the request for the successfully logged in LPAUser
 * @async
 * @param {import('express').Request} req
 * @param {import('appeals-service-api').Api.AppealUser} user
 * @param {string} access_token
 * @param {string} id_token
 * @param {Date} expiry
 * @returns {Promise<void>}
 */
const createLPAUserSession = async (req, user, access_token, id_token, expiry) => {
	let lpa = await getLPA(user.lpaCode);

	req.session.user = {
		...user,
		lpaName: lpa.name,
		lpaDomain: lpa.domain,
		access_token: access_token,
		id_token: id_token,
		expiry: expiry
	};
};

/**
 * retrieves the user from session
 * @param {import('express').Request} req
 * @returns {AppealUserSession| LPAUser} appellant user
 */
const getUserFromSession = (req) => {
	return req.session.user;
};

/**
 * Gets lpaUser by their id
 * @async
 * @param {import('express').Request} req
 * @param {string} userId
 * @returns {Promise<import('appeals-service-api').Api.AppealUser>}
 */
const getLPAUser = async (req, userId) => {
	const user = await req.appealsApiClient.getUserById(userId);
	if (!user.isLpaUser) throw new Error('not an lpa user');
	return user;
};

/**
 * Returns the status of the LPA User. Status is either 'added' or 'confirmed'
 * @async
 * @param {import('express').Request} req
 * @param {string} userId
 * @returns {Promise<string|undefined>}
 */
const getLPAUserStatus = async (req, userId) => {
	const user = await getLPAUser(req, userId);
	return user.lpaStatus;
};

/**
 * @param {import('express').Request} req
 * @param {string} userId
 * @param {"added" | "confirmed" | "removed"} status
 * @returns {Promise<void>}
 */
const setLPAUserStatus = async (req, userId, status) => {
	if (!Object.values(STATUS_CONSTANTS).includes(status)) return;
	await req.appealsApiClient.setLPAUserStatus(userId, status);
};

module.exports = {
	createAppealUserSession,
	getUserFromSession,
	createLPAUserSession,
	getLPAUserStatus,
	setLPAUserStatus,
	getLPAUser
};
