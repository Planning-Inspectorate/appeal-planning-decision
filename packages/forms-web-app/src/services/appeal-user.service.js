/**
 * @typedef {Object} AppealUserSession
 * @property {string} access_token
 * @property {string} id_token
 */

/**
 * Adds appealUser to session req.session.appealUser
 * @param {import('express').Request} req
 * @param {string} access_token
 * @param {string} id_token
 * @returns {void}
 */
const createAppealUserSession = (req, access_token, id_token) => {
	req.session.appealUser = {
		access_token: access_token,
		id_token: id_token
	};
};

/**
 * retrieves the appealUser from session
 * @param {import('express').Request} req
 * @returns {AppealUserSession} lpa user
 */
const getAppealUserSession = (req) => {
	return req.session.appealUser;
};

module.exports = {
	createAppealUserSession,
	getAppealUserSession
};
