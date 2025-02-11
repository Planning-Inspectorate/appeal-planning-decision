const {
	createSavedAppealDocument,
	getSavedAppealDocument,
	sendContinueWithAppealEmail
} = require('../services/save-and-return.service');

async function saveAndReturnCreate(req, res) {
	const appeal = req.body;
	if (!appeal || !appeal.id) {
		return res.status(400).send('Invalid Id');
	}

	const sendEmail = appeal.skipReturnEmail !== true;

	await createSavedAppealDocument(appeal.id);

	if (sendEmail) {
		await sendContinueWithAppealEmail(appeal);
	}

	res.status(201).json(appeal);
}

async function saveAndReturnGet(req, res) {
	const { id } = req.params;
	const appeal = await getSavedAppealDocument(id);
	res.status(200).json(appeal);
}

module.exports = {
	saveAndReturnCreate,
	saveAndReturnGet
};
