const {
	saveAndReturnCreateService,
	saveAndReturnNotifyContinue,
	saveAndReturnTokenService,
	saveAndReturnNotifyCode,
	saveAndReturnGetServiceToken
} = require('../services/save-and-return.service');
const { getAppeal } = require('../services/appeal.service');

async function saveAndReturnCreate(req, res) {
	const appeal = req.body;
	if (!appeal || !appeal.id) {
		res.status(400).send('Invalid Id');
		throw new Error('');
	}
	const token = await saveAndReturnCreateService(appeal);
	await saveAndReturnNotifyContinue(appeal, token);
	res.status(201).send(appeal);
}

async function saveAndReturnGet(req, res) {
	const { token } = req.params;
	const appeal = await saveAndReturnGetServiceToken(token);
	res.status(200).send(appeal);
}

async function saveAndReturnToken(req, res) {
	const { token } = req.params;
	if (!req.params || !req.params.token) {
		res.status(400).send('Invalid Id');
		throw new Error('');
	}
	const savedAppeal = await saveAndReturnTokenService(token);
	const appeal = await getAppeal(savedAppeal.appealId);
	await saveAndReturnNotifyCode(appeal, savedAppeal.token);
	res.status(200).send({});
}

module.exports = {
	saveAndReturnCreate,
	saveAndReturnGet,
	saveAndReturnToken
};
