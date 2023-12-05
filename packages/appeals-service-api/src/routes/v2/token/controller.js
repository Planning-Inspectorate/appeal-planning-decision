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
 * checks code against id
 * @type {import('express').Handler}
 */
async function tokenPostV2(req, res) {
	const { token, emailAddress } = req.body;
	const { id } = req.body;

	const user = await getUser(emailAddress, id);
	if (!user) {
		throw ApiError.userNotFound();
	}

	const securityToken = await tokenRepo.getByUserId(user.id);

	if (!securityToken) {
		throw ApiError.invalidToken();
	}

	if (securityToken.attempts && securityToken.attempts > 3) {
		res.status(429).send({});
		return;
	}

	if (securityToken.token !== token) {
		throw ApiError.invalidToken();
	}

	// user has confirmed email for first time so set enrolled flag
	if (!user.isEnrolled) {
		user.isEnrolled = true;
		await appealUserRepository.updateUser(user);
	}

	res.status(200).send({
		id: id,
		action: securityToken?.action,
		createdAt: securityToken?.tokenGeneratedAt
	});
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
	tokenPostV2,
	MILLISECONDS_BETWEEN_TOKENS
};
