const {
	createOrUpdateToken,
	getTokenIfExists,
	getTokenCreatedAt
} = require('../../../services/token.service');
const { getAppeal } = require('../../..//services/appeal.service');
const { sendSecurityCodeEmail } = require('../../../lib/notify');
const { AppealUserRepository } = require('../../../repositories/sql/appeal-user-repository');
const ApiError = require('../../../errors/apiError');

const appealUserRepository = new AppealUserRepository();

const MILLISECONDS_BETWEEN_TOKENS = 10_000;

/**
 * sends a code to user email
 * @type {import('express').Handler}
 */
async function tokenPutV2(req, res) {
	const { id, action } = req.body;
	let { emailAddress } = req.body;

	let user;

	if (!emailAddress) {
		// look up email from appeal
		const savedAppeal = await getAppeal(id);
		emailAddress = savedAppeal.email;

		// check if user exists already
		user = await appealUserRepository.getByEmail(emailAddress);

		// create new user for email in appeal
		if (!user) {
			user = await appealUserRepository.createUser({
				email: emailAddress,
				isEnrolled: false
			});
		}
	} else {
		user = await appealUserRepository.getByEmail(emailAddress);
	}

	if (!user) {
		throw ApiError.userNotFound();
	}

	const tokenCreatedAt = await getTokenCreatedAt(user.id);

	if (tokenCreatedAt) {
		// to avoid issue with multiple requests sending multiple emails
		const secondsSinceTokenCreation = getMilliSecondsSinceDate(tokenCreatedAt);
		if (secondsSinceTokenCreation < MILLISECONDS_BETWEEN_TOKENS) {
			res.status(200).send({});
			return;
		}
	}

	const token = await createOrUpdateToken(user.id, action);
	await sendSecurityCodeEmail(emailAddress, token, id);

	res.status(200).send({});
}

/**
 * @param {Date} date
 * @returns {number}
 */
function getMilliSecondsSinceDate(date) {
	return new Date().getTime() - new Date(date).getTime();
}

/**
 * checks code against id
 * @type {import('express').Handler}
 */
async function tokenPostV2(req, res) {
	const { token, emailAddress } = req.body;
	const { id } = req.body;
	let user;

	if (emailAddress) {
		user = await appealUserRepository.getByEmail(emailAddress);
	} else {
		const savedAppeal = await getAppeal(id);
		user = await appealUserRepository.getByEmail(savedAppeal.email);
	}

	if (!user) {
		throw ApiError.userNotFound();
	}

	const securityToken = await getTokenIfExists(user.id);

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

module.exports = {
	tokenPutV2,
	tokenPostV2,
	MILLISECONDS_BETWEEN_TOKENS
};
