const express = require('express');
const { FinalCommentsService } = require('../services/final-comments.service');

const router = express.Router();

const finalCommentsService = new FinalCommentsService();

router.post('/', async (req, res) => {
	const caseReference = req.body.case_reference;
	const appellantEmail = req.body.appellant_email;
	let statusCode = 409;
	if (await finalCommentsService.createFinalComments(caseReference, appellantEmail)) {
		statusCode = 204;
	}

	res.status(statusCode).send();
});

router.get('/:case_reference/secure_code', async (req, res) => {
	let statusCode = 200;
	let message = "";
	
	try {
		await finalCommentsService.sendSecureCodeForFinalComment(req.params.case_reference)
	} catch(error) {
		statusCode = error.code
		message = { error: message };
	} finally {
		res.status(statusCode).send(message);
	}
});

module.exports = router;