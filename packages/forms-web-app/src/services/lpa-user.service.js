const { getUserById, setUserStatus } = require('../lib/appeals-api-wrapper');

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
 * @property {boolean} enabled - If the user is currently enabled.
 * @property {string} lpaCode - If code of the lpa the user belongs to.
 */

/**
 * Creates the user object within the session object of the request for the successfully logged in LPAUser
 * @async
 * @param {UserId} userId
 * @returns {Promise<User>}
 */
const getLPAUser = async (userId) => {
	return await getUserById(userId);
};

/**
 * Creates the user object within the session object of the request for the successfully logged in LPAUser
 * @async
 * @param {ExpressRequest} req
 * @param {UserId} userId
 * @returns {Promise<void>}
 */
const createLPAUserSession = async (req, userId) => {
	let user = await getLPAUser(userId);
	req.session.lpaUser = user;
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
	return await getLPAUser(userId).status;
};

const setLPAUserStatus = async (userId, status) => {
	if (!['added', 'confirmed'].includes(status)) return;
	await setUserStatus(userId, status);
};

module.exports = {
	createLPAUserSession,
	getLPAUserFromSession,
	getLPAUserStatus,
	setLPAUserStatus
};
