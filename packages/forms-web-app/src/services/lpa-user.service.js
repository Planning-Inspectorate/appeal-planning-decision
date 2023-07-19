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
 * An LPA user from the DB
 * @typedef {Object} DBUser
 * @property {UserId} _id - The id of the user.
 * @property {string} email - The email of the user.
 * @property {boolean} isAdmin - If the user is an admin user (cannot be deleted).
 * @property {string} status - The status of a user (STATUS_CONSTANTS)
 * @property {string} lpaCode - If code of the lpa the user belongs to.
 */

/**
 * Gets lpaUser by their id
 * @async
 * @param {UserId} userId
 * @returns {Promise<DBUser>}
 */
const getLPAUser = async (userId) => {
	return await getUserById(userId);
};

/**
 * Creates the user object within the session object of the request for the successfully logged in LPAUser
 * @async
 * @param {ExpressRequest} req
 * @param {DBUser} user
 * @returns {Promise<void>}
 */
const createLPAUserSession = async (req, user) => {
	req.session.lpaUser = user;

	let lpa = await getLPA(user.lpaCode);

	req.session.lpaUser = {
		...req.session.lpaUser,
		lpaName: lpa.name,
		lpaDomain: lpa.domain
	};
};

/**
 * retrives the LPAUser from session
 * @param {ExpressRequest} req
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
