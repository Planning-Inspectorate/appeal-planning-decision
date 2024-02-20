const { getUserById, setUserStatus, getLPA } = require('../lib/appeals-api-wrapper');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');
/**
 * The id of the user, in mongodb object id format: /^[a-f\\d]{24}$/i
 * @typedef {string} UserId
 */

/**
 * An LPA user
 * @typedef {Object} User
 * @property {UserId} _id - The id of the user.
 * @property {string} email - The email of the user.
 * @property {boolean} isAdmin - If the user is an admin user (cannot be deleted).
 * @property {string} status - The status of a user (STATUS_CONSTANTS)
 * @property {string} lpaCode - If code of the lpa the user belongs to.
 * @property {string} lpaName - Name of the lpa the user belongs to.
 * @property {string} lpaDomain - Domain of the lpa the user belongs to.
 */

/**
 * Gets lpaUser by their id
 * @async
 * @param {UserId} userId
 * @returns {Promise<import('appeals-service-api').Api.AppealUser>}
 */
const getLPAUser = async (userId) => {
	return await getUserById(userId);
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
 * @returns {User} lpa user
 */
const getLPAUserFromSession = (req) => {
	return req.session.lpaUser;
};

/**
 * Returns the status of the LPA User. Status is either 'added' or 'confirmed'
 * @async
 * @param {UserId} userId
 * @returns {Promise<string>}
 */
const getLPAUserStatus = async (userId) => {
	const user = await getLPAUser(userId);
	return user.status;
};

const setLPAUserStatus = async (userId, status) => {
	if (!Object.values(STATUS_CONSTANTS).includes(status)) return;
	await setUserStatus(userId, status);
};

module.exports = {
	createLPAUserSession,
	getLPAUserFromSession,
	getLPAUserStatus,
	setLPAUserStatus,
	getLPAUser
};
