const ApiError = require('#errors/apiError');
const { sendSecurityCodeEmail } = require('#lib/notify');
const { getAppeal } = require('../../../services/appeal.service');
const TokenRepository = require('./repo');
const { AppealUserRepository } = require('#repositories/sql/appeal-user-repository');

const appealUserRepository = new AppealUserRepository();
const tokenRepo = new TokenRepository();

const MILLISECONDS_BETWEEN_TOKENS = 10_000;

/**
 * @typedef { import("@prisma/client").AppealUser } AppealUser
 */

/**
 * todo: move to auth server
 * sends a code to user email
 * @type {import('express').Handler}
 */
async function tokenPutV2(req, res) {
	const { id, action, emailAddress } = req.body;

	const user = await getUser(emailAddress, id, true);
	if (!user) {
		throw ApiError.userNotFound();
	}

	const token = await tokenRepo.createOrUpdate(user.id, action);

	if (token) {
		await sendSecurityCodeEmail(user.email, token, user.id);
	}

	res.status(200).send({});
}

/**
 * gets a user by either email or looks up the user associated with an appeal
 * @param {string} emailAddress - user email
 * @param {string} id - appeal id
 * @param {boolean} [createUserFromAppealIfMissing]
 * @returns {Promise<AppealUser|null>}
 */
async function getUser(emailAddress, id, createUserFromAppealIfMissing = false) {
	if (emailAddress) {
		return await appealUserRepository.getByEmail(emailAddress);
	}

	const savedAppeal = await getAppeal(id);
	const appealUser = await appealUserRepository.getByEmail(savedAppeal.email);

	if (!appealUser && createUserFromAppealIfMissing) {
		return await appealUserRepository.createUser({
			email: savedAppeal.email,
			isEnrolled: false
		});
	}

	return appealUser;
}

module.exports = {
	tokenPutV2,
	MILLISECONDS_BETWEEN_TOKENS
};
