const express = require('express');
const router = express.Router();

const BackOfficeService = require('../services/back-office.service');

const backOfficeService = new BackOfficeService();

router.post('/appeals/:id', async (req, res) => {
	let statusCode = 202;
	let body = '';
	try {
		body = await backOfficeService.saveAppealForSubmission(req.params.id);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

router.put('/appeals', async (req, res) => {
	await backOfficeService.submitAppeals();
	res.sendStatus(202);
});

module.exports = router;
