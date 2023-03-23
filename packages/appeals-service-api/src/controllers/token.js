const {
	createOrUpdateTokenDocument,
	getTokenDocumentIfExists
} = require('../services/token.service');
const { getAppeal } = require('../services/appeal.service');
const { sendSecurityCodeEmail } = require('../lib/notify');

async function tokenPut(req, res) {
	const { id } = req.body;
	let { emailAddress } = req.body;
	const token = await createOrUpdateTokenDocument(id);

	if (!emailAddress) {
		const savedAppeal = await getAppeal(id);
		emailAddress = savedAppeal.email;
	}

	await sendSecurityCodeEmail(emailAddress, token, id);
	res.status(200).send({});
}

async function tokenPost(req, res) {
	const { id, token } = req.body;

	const document = await getTokenDocumentIfExists(id, token);

	if (!document) {
		res.status(200).send({});
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
