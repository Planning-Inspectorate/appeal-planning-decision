const {
	createOrUpdateTokenDocument,
	createOrUpdateToken,
	getTokenDocumentIfExists,
	getTokenIfExists,
	getTokenDocumentCreatedAt,
	getTokenCreatedAt
} = require('../services/token.service');
const { getAppeal } = require('../services/appeal.service');
const { sendSecurityCodeEmail } = require('../lib/notify');
const { AppealUserRepository } = require('../repositories/sql/appeal-user-repository');
const ApiError = require('../errors/apiError');

const appealUserRepository = new AppealUserRepository();

/**
 * sends a code to user email
 * @type {import('express').Handler}
 */
async function tokenPut(req, res) {
	const { id, action } = req.body;
	let { emailAddress } = req.body;

	if (!emailAddress) {
		const savedAppeal = await getAppeal(id);
		emailAddress = savedAppeal.email;
	}

	const tokenCreatedAt = await getTokenDocumentCreatedAt(id);

	if (tokenCreatedAt) {
		const timeSinceTokenCreatedInSeconds =
			(new Date().getTime() - new Date(tokenCreatedAt).getTime()) / 1000;
		if (timeSinceTokenCreatedInSeconds < 10) {
			res.status(200).send({});
			return;
		}
	}

	const token = await createOrUpdateTokenDocument(id, action);
	await sendSecurityCodeEmail(emailAddress, token, id);

	res.status(200).send({});
}

/**
 * sends a code to user email
 * @type {import('express').Handler}
 */
async function tokenPutV2(req, res) {
	const { id, action } = req.body;
	let { emailAddress } = req.body;

	let user;

	if (!emailAddress) {
		const savedAppeal = await getAppeal(id);
		emailAddress = savedAppeal.email;
		user = await appealUserRepository.getByEmail(emailAddress);
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
		const timeSinceTokenCreatedInSeconds =
			(new Date().getTime() - new Date(tokenCreatedAt).getTime()) / 1000;
		if (timeSinceTokenCreatedInSeconds < 10) {
			res.status(200).send({});
			return;
		}
	}

	const token = await createOrUpdateToken(user.id, action);
	await sendSecurityCodeEmail(emailAddress, token, id);

	res.status(200).send({});
}

/**
 * checks code against id
 * @type {import('express').Handler}
 */
async function tokenPost(req, res) {
	const { id, token } = req.body;

	const document = await getTokenDocumentIfExists(id);

	if (!document) {
		res.status(200).send({});
		return;
	}

	if (document.attempts && document.attempts > 3) {
		res.status(429).send({});
		return;
	}

	if (document.token !== token) {
		res.status(200).send({});
		return;
	}

	res.status(200).send({
		id: document?.id,
		action: document?.action,
		createdAt: document?.createdAt
	});
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
		res.status(200).send({});
		return;
	}

	if (securityToken.attempts && securityToken.attempts > 3) {
		res.status(429).send({});
		return;
	}

	if (securityToken.token !== token) {
		res.status(200).send({});
		return;
	}

	if (user && !user.isEnrolled) {
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
	tokenPut,
	tokenPutV2,
	tokenPost,
	tokenPostV2
};
