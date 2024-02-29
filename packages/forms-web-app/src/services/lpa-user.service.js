const { getLPA } = require('../lib/appeals-api-wrapper');
const { apiClient } = require('../lib/appeals-api-client');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

/**
 * @typedef {Object} LpaUserAdditions
 * @property {string} lpaName - Name of the lpa the user belongs to.
 * @property {string} lpaDomain - Domain of the lpa the user belongs to.
 *
 * @typedef {import('appeals-service-api').Api.AppealUser & LpaUserAdditions} LPAUser
 */

/**
 * Gets lpaUser by their id
 * @async
 * @param {string} userId
 * @returns {Promise<import('appeals-service-api').Api.AppealUser>}
 */
const getLPAUser = async (userId) => {
	const user = await apiClient.getUserById(userId);
	if (!user.isLpaUser) throw new Error('not an lpa user');
	return user;
};

/**
 * Creates the user object within the session object of the request for the successfully logged in LPAUser
 * @async
 * @param {import('express').Request} req
 * @param {Promise<import('appeals-service-api').Api.AppealUser>} user
 * @param {string} access_token
 * @param {string} id_token
 * @param {Date} expiry
 * @returns {Promise<void>}
 */
const createLPAUserSession = async (req, user, access_token, id_token, expiry) => {
	req.session.lpaUser = user;

	let lpa = await getLPA(user.lpaCode);

	req.session.lpaUser = {
		...req.session.lpaUser,
		lpaName: lpa.name,
		lpaDomain: lpa.domain,
		access_token: access_token,
		id_token: id_token,
		expiry: expiry
	};
};

/**
 * retrieves the LPAUser from session
 * @param {import('express').Request} req
 * @returns {LPAUser} lpa user
 */
const getLPAUserFromSession = (req) => {
	return req.session.lpaUser;
};

/**
 * Returns the status of the LPA User. Status is either 'added' or 'confirmed'
 * @async
 * @param {string} userId
 * @returns {Promise<string|undefined>}
 */
const getLPAUserStatus = async (userId) => {
	const user = await getLPAUser(userId);
	return user.lpaStatus;
};

/**
 *
 * @param {string} userId
 * @param {"added" | "confirmed" | "removed"} status
 * @returns {Promise<void>}
 */
const setLPAUserStatus = async (userId, status) => {
	if (!Object.values(STATUS_CONSTANTS).includes(status)) return;
	await apiClient.setLPAUserStatus(userId, status);
};

module.exports = {
	createLPAUserSession,
	getLPAUserFromSession,
	getLPAUserStatus,
	setLPAUserStatus,
	getLPAUser
};
