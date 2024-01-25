/**
 * @typedef {Object} AppealUserSession
 * @property {string} id
 * @property {string} email
 */

/**
 * Adds appealUser to session req.session.appealUser
 * @param {import('express').Request} req
 * @param {import('appeals-service-api').Api.AppealUser} user
 * @returns {void}
 */
const createAppealUserSession = (req, user) => {
	req.session.appealUser = {
		id: user.id,
		email: user.email
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
