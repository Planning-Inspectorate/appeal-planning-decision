const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	await backOfficeV2Service.submitQuestionnaire(req.params.caseReference);

	res.sendStatus(200);
};
