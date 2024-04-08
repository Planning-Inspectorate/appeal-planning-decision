/**
 * @typedef {Object} AppealUserSession
 * @property {string} access_token
 * @property {string} id_token
 * @property {Date} expiry
 */

/**
 * Adds appealUser to session req.session.appealUser
 * @param {import('express').Request} req
 * @param {string} access_token
 * @param {string} id_token
 * @param {Date} expiry
 * @returns {void}
 */
const createAppealUserSession = (req, access_token, id_token, expiry) => {
	req.session.appealUser = {
		access_token: access_token,
		id_token: id_token,
		expiry: expiry
	};
};

/**
 * retrieves the appealUser from session
 * @param {import('express').Request} req
 * @returns {AppealUserSession} appellant user
 */
const getAppealUserSession = (req) => {
	return req.session.appealUser;
};

module.exports = {
	createAppealUserSession,
	getAppealUserSession
};
