const { AppealUserRepository } = require('../repositories/sql/appeal-user-repository');
const ApiError = require('../errors/apiError');

const appealUserRepository = new AppealUserRepository();

async function createUser(user) {
	if (!user || !user.lpaCode || !user.email) {
		throw ApiError.badRequest();
	}

	return await appealUserRepository.createUser(user);
}

async function getUserByEmail(email) {
	if (!email) throw ApiError.badRequest();
	const user = await appealUserRepository.getByEmail(email);
	if (user) return user;
	throw ApiError.userNotFound();
}

module.exports = {
	createUser,
	getUserByEmail
};
