const { getAppealsForUser } = require('./service');
const ApiError = require('#errors/apiError');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 */

/**
 * @type {import('express').Handler}
 */
async function getUserAppeals(req, res) {
	const userId = req.auth.payload.sub;

	const { role } = req.query;

	if (!permittedRole(role)) {
		throw ApiError.invalidRole();
	}

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const content = await getAppealsForUser(userId, role);
	if (!content) {
		throw ApiError.userNotFound();
	}

	res.status(200).json(content);
}

/**
 *
 * @param {AppealToUserRoles} role
 * @returns {boolean}
 */
const permittedRole = (role) => {
	const permittedRoles = [
		APPEAL_USER_ROLES.AGENT,
		APPEAL_USER_ROLES.APPELLANT,
		APPEAL_USER_ROLES.RULE_6_PARTY
	];

	return permittedRoles.includes(role);
};

module.exports = {
	getUserAppeals
};
