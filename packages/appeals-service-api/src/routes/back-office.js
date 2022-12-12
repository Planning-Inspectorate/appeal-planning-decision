const express = require('express');
const router = express.Router();

const BackOfficeService = require('../services/back-office.service');

const backOfficeService = new BackOfficeService();

router.put('/appeals/:id', async (req, res) => {
	let statusCode = 200;
	let body = '';
	try {
		body = await backOfficeService.submitAppeal(req.params.id);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

module.exports = router;
