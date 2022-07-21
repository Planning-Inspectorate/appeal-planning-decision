const {
	confirmEmailCreateService,
	confirmEmailNotifyContinue,
	confirmEmailGetService
} = require('../services/confirm-email.service');

async function confirmEmailGet(req, res) {
	const { id } = req.params;
	const foundSaved = await confirmEmailGetService(id);
	res.status(200).send(foundSaved);
}

async function confirmEmailCreate(req, res) {
	const appeal = req.body;
	if (!appeal || !appeal.id) {
		res.status(400).send('Invalid Id');
		throw new Error('');
	}
	const savedAppealId = await confirmEmailCreateService(appeal);
	const saved = {appealId: savedAppealId}
	await confirmEmailNotifyContinue(appeal);
	res.status(201).send(saved);
}

module.exports = {
	confirmEmailCreate,
	confirmEmailGet
};
