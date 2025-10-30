const { AppealUserRepository } = require('#repositories/sql/appeal-user-repository');
const ApiError = require('#errors/apiError');
const { APPEAL_USER_ROLES_ARRAY } = require('@pins/database/src/seed/data-static');
const { STATUS_CONSTANTS, APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const logger = require('#lib/logger');
const appealUserRepository = new AppealUserRepository();

/**
 * @typedef { import("@prisma/client").AppealToUser } AppealToUser
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef { import("@prisma/client").AppealUser } AppealUser
 * @typedef { import("@prisma/client").Prisma.AppealUserWhereInput } AppealUserWhere
 */

/**
 * @param {AppealUser} user
 * @returns {Promise<AppealUser>}
 */
async function createUser(user) {
	if (!user || !user.email) {
		throw ApiError.badRequest();
	}

	const existingUser = await appealUserRepository.search({
		email: user.email
	});

	if (existingUser.length) {
		const currentUser = existingUser[0];

		const isAddingRemovedLpaUser =
			currentUser.isLpaUser && currentUser.lpaStatus === STATUS_CONSTANTS.REMOVED;
		const isAddingUserToLpa = user.isLpaUser && !currentUser.isLpaUser;

		if (!isAddingRemovedLpaUser && !isAddingUserToLpa) {
			throw ApiError.userDuplicate();
		}

		return await appealUserRepository.updateUser({
			...user,
			id: currentUser.id,
			lpaStatus: STATUS_CONSTANTS.ADDED
		});
	}
	return await appealUserRepository.createUser(user);
}

/**
 * @param {Object} options
 * @param {string} [options.lpaCode]
 * @returns {Promise<AppealUser[]>}
 */
async function searchUsers(options = {}) {
	/** @type {AppealUserWhere} */
	let search = {};
	if (options.lpaCode) {
		search.lpaCode = options.lpaCode;
		search.NOT = {
			lpaStatus: STATUS_CONSTANTS.REMOVED
		};
	}
	return appealUserRepository.search(search);
}

/**
 * @param {string} email
 * @returns {Promise<AppealUser>}
 */
async function getUserByEmail(email) {
	if (!email) throw ApiError.badRequest();

	try {
		const user = await appealUserRepository.getByEmail(email);
		if (user) return user;
	} catch (error) {
		logger.error({ error }, `Error: failed to find user by email`);
	}

	throw ApiError.userNotFound();
}

/**
 * @param {string} id
 * @returns {Promise<AppealUser>}
 */
async function getUserById(id) {
	if (!id) throw ApiError.badRequest();

	try {
		const user = await appealUserRepository.getById(id);
		if (user) return user;
	} catch (error) {
		logger.error({ error }, `Error: failed to find user by id`);
	}

	throw ApiError.userNotFound();
}

/**
 * @param {AppealUser} user
 * @returns {Promise<AppealUser>}
 */
async function updateUser(user) {
	if (!user || !user.id) {
		throw ApiError.badRequest();
	}

	return await appealUserRepository.updateUser(user);
}

/**
 * @param {string} id
 * @returns {Promise<AppealUser>}
 */
async function removeLPAUser(id) {
	const user = await getUserById(id);

	// can only remove lpa users
	if (!user || !user.isLpaUser) {
		throw ApiError.badRequest();
	}

	user.lpaStatus = STATUS_CONSTANTS.REMOVED;

	return appealUserRepository.updateUser(user);
}

/**
 * Sets user's role on an appeal
 * @param {string} id
 * @param {string} appealId
 * @param {string|undefined} role
 * @returns {Promise<AppealToUser>}
 */
async function linkUserToAppeal(id, appealId, role) {
	// allow undefined through as we can provide default on creation
	if (
		role !== undefined &&
		!APPEAL_USER_ROLES_ARRAY.some((appealRole) => appealRole.name === role)
	) {
		throw ApiError.badRequest('invalid role');
	}

	return appealUserRepository.linkUserToAppeal(id, appealId, role);
}

/**
 * Unlink user's specified role on an appeal
 * @param {string} id
 * @param {string} appealId
 * @param {AppealToUserRoles} role
 * @returns {Promise<void>}
 */
async function unlinkUserFromAppeal(id, appealId, role) {
	// At present the only use case is for rule 6 parties, but this may change in future
	if (role !== APPEAL_USER_ROLES.RULE_6_PARTY) {
		throw ApiError.badRequest('invalid role for unlink from appeal');
	}

	return await appealUserRepository.unlinkUserFromAppeal(id, appealId, role);
}

/**
 * @param {string} userLookup currently route only used when looking up by email
 * @returns {Promise<boolean>}
 */
async function isRule6User(userLookup) {
	const count = await appealUserRepository.countUsersWhereEmailAndRule6Party(userLookup);

	return count > 0;
}

module.exports = {
	createUser,
	searchUsers,
	getUserByEmail,
	getUserById,
	updateUser,
	removeLPAUser,
	linkUserToAppeal,
	unlinkUserFromAppeal,
	isRule6User
};
