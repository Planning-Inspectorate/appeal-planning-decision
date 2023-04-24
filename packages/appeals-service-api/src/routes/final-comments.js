const express = require('express');
const { FinalCommentsService } = require('../services/final-comments.service');
const logger = require('../lib/logger');
const router = express.Router();

const finalCommentsService = new FinalCommentsService();

router.post('/', async (req, res) => {
	const finalComment = req.body;
	let body = '';

	let statusCode = 204;
	try {
		body = await finalCommentsService.createFinalComment(finalComment);
	} catch (error) {
		logger.error(`Failed to create: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

router.get('/:case_reference', async (req, res) => {
	let statusCode = 201;
	let body = {};

	try {
		body = await finalCommentsService.getFinalComment(req.params.case_reference);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

router.get('/appeal/:case_reference', async (req, res) => {
	let statusCode = 200;
	let body = {};
	try {
		body = await finalCommentsService.getFinalCommentData(req.params.case_reference);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

module.exports = router;
