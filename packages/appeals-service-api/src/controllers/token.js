const {
	createOrUpdateTokenDocument,
	getTokenDocumentIfExists,
	getTokenDocumentCreatedAt
} = require('../services/token.service');
const { getAppeal } = require('../services/appeal.service');
const { sendSecurityCodeEmail } = require('../lib/notify');

const MILLISECONDS_BETWEEN_TOKENS = 10_000;

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
		const secondsSinceTokenCreation = getMilliSecondsSinceDate(tokenCreatedAt);
		if (secondsSinceTokenCreation < MILLISECONDS_BETWEEN_TOKENS) {
			res.status(200).send({});
			return;
		}
	}

	const token = await createOrUpdateTokenDocument(id, action);
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

	if (document.token.toUpperCase() !== token.toUpperCase()) {
		res.status(200).send({});
		return;
	}

	res.status(200).send({
		id: document?.id,
		action: document?.action,
		createdAt: document?.createdAt
	});
}

module.exports = {
	tokenPut,
	tokenPost,
	MILLISECONDS_BETWEEN_TOKENS
};
