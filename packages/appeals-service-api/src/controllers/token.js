const {
	createOrUpdateTokenDocument,
	getTokenDocumentIfExists,
	getTokenCreatedAt
} = require('../services/token.service');
const { getAppeal } = require('../services/appeal.service');
const { sendSecurityCodeEmail } = require('../lib/notify');

//sends a code to user email
async function tokenPut(req, res) {
	const { id, action } = req.body;
	let { emailAddress } = req.body;

	if (!emailAddress) {
		const savedAppeal = await getAppeal(id);
		emailAddress = savedAppeal.email;
	}

	const tokenCreatedAt = await getTokenCreatedAt(id);

	if (tokenCreatedAt) {
		const timeSinceTokenCreatedInSeconds = (new Date() - new Date(tokenCreatedAt)) / 1000;
		if (timeSinceTokenCreatedInSeconds < 10) {
			return res.status(200).send({});
		}
	}

	const token = await createOrUpdateTokenDocument(id, action);
	await sendSecurityCodeEmail(emailAddress, token, id);

	res.status(200).send({});
}

//checks code against id
async function tokenPost(req, res) {
	const { id, token, action } = req.body;

	const document = await getTokenDocumentIfExists(id);

	if (!document) {
		return res.status(200).send({});
	}

	if (document.attempts && document.attempts > 3) {
		// reset attempts and code
		await createOrUpdateTokenDocument(id, action);
		return res.status(429).send({});
	}

	if (document.token !== token) {
		return res.status(200).send({});
	}

	return res.status(200).send({
		id: document?.id,
		action: document?.action,
		createdAt: document?.createdAt
	});
}

module.exports = {
	tokenPut,
	tokenPost
};
