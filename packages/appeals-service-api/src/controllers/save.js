const {
	createSavedAppealDocument,
	getSavedAppealDocument,
	sendContinueWithAppealEmail
} = require('../services/save-and-return.service');

async function saveAndReturnCreate(req, res) {
	const appeal = req.body;
	if (!appeal || !appeal.id) {
		res.status(400).send('Invalid Id');
		throw new Error('');
	}
	await createSavedAppealDocument(appeal.id);
	await sendContinueWithAppealEmail(appeal);
	res.status(201).send(appeal);
}

async function saveAndReturnGet(req, res) {
	const { id } = req.params;
	const appeal = await getSavedAppealDocument(id);
	res.status(200).send(appeal);
}

module.exports = {
	saveAndReturnCreate,
	saveAndReturnGet
};
