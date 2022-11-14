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

router.get('/:case_reference', async (req, res) => {
	const caseReference = req.params.case_reference;
	let statusCode = 404;
	if (await finalCommentsService.checkFinalCommentExists(caseReference)) {
		statusCode = 200;
	}

	res.status(statusCode).send();
});

module.exports = router;
