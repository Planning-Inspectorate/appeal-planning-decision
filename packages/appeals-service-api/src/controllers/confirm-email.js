const {
	confirmEmailCreateService,
	confirmEmailNotifyContinue,
	confirmEmailGetService
} = require('../services/confirm-email.service');

async function confirmEmailGet(req, res) {
	const { token } = req.params;
	const foundToken = await confirmEmailGetService(parseInt(token));
	res.status(200).send(foundToken);
}

async function confirmEmailCreate(req, res) {
	const appeal = req.body;
	if (!appeal || !appeal.id) {
		res.status(400).send('Invalid Id');
		throw new Error('');
	}
	const token = await confirmEmailCreateService();
	await confirmEmailNotifyContinue(appeal, token);
	res.status(201).send(appeal);
}

module.exports = {
	confirmEmailCreate,
	confirmEmailGet
};
