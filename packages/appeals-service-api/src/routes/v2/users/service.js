const { AppealUserRepository } = require('#repositories/sql/appeal-user-repository');
const ApiError = require('#errors/apiError');
const { APPEAL_USER_ROLES_ARRAY } = require('../../../db/seed/data-static');

const appealUserRepository = new AppealUserRepository();

/**
 * @typedef { import("@prisma/client").AppealToUser } AppealToUser
 */

async function createUser(user) {
	if (!user || !user.email) {
		throw ApiError.badRequest();
	}

	return await appealUserRepository.createUser(user);
}

async function updateUser(user) {
	if (!user || !user.email) {
		throw ApiError.badRequest();
	}

	return await appealUserRepository.updateUser(user);
}

async function getUserByEmail(email) {
	if (!email) throw ApiError.badRequest();
	const user = await appealUserRepository.getByEmail(email);
	if (user) return user;
	throw ApiError.userNotFound();
}

/**
 * Sets user's role on an appeal
 * @param {string} email
 * @param {string} appealId
 * @param {string|undefined} role
 * @returns {Promise<AppealToUser>}
 */
async function linkUserToAppeal(email, appealId, role) {
	// allow undefined through as we can provide default on creation
	if (
		role !== undefined &&
		!APPEAL_USER_ROLES_ARRAY.some((appealRole) => appealRole.name === role)
	) {
		throw ApiError.badRequest('invalid role');
	}

	const user = await getUserByEmail(email);

	if (!user) {
		throw ApiError.userNotFound();
	}

	return appealUserRepository.linkUserToAppeal(user.id, appealId, role);
}

module.exports = {
	createUser,
	getUserByEmail,
	linkUserToAppeal,
	updateUser
};
