const {
	createOrUpdateTokenDocument,
	getTokenDocumentIfExists,
	getTokenCreatedAt
} = require('../services/token.service');
const { getAppeal } = require('../services/appeal.service');
const { sendSecurityCodeEmail } = require('../lib/notify');

//sends a code to user email
async function tokenPut(req, res) {
	const { id } = req.body;
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

	const token = await createOrUpdateTokenDocument(id);
	await sendSecurityCodeEmail(emailAddress, token, id);

	res.status(200).send({});
}

//checks code against id
async function tokenPost(req, res) {
	const { id, token } = req.body;

	const document = await getTokenDocumentIfExists(id, token);

	if (!document) {
		return res.status(200).send({});
	}

	res.status(200).send({
		id: document?.id,
		createdAt: document?.createdAt
	});
}

module.exports = {
	tokenPut,
	tokenPost
};
