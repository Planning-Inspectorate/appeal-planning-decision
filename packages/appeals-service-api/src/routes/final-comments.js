const express = require('express');
const { FinalCommentsService } = require('../services/final-comments.service');

const router = express.Router();

const finalCommentsService = new FinalCommentsService();

router.post('/', async (req, res) => {
	const caseReference = req.body.caseReference;
	const appellantEmail = req.body.appellant_email;
	if (await finalCommentsService.createFinalComments(caseReference, appellantEmail)) {
		return res.status(204);
	}

	return res.status(409);
});

router.get('/:case_reference', async (req, res) => {
	const caseReference = req.query.case_reference;
	if (await finalCommentsService.checkFinalCommentExists(caseReference)) {
		return res.status(200);
	}

	return 404;
});

module.exports = router;
