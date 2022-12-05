const express = require('express');
const router = express.Router();

const { HorizonService } = require('../services/horizon.service');

const horizonService = new HorizonService();

router.post('/appeals/:id', async (req, res) => {
	let statusCode = 200;
	let body = '';
	try {
		console.log(req.params.id);
		body = await horizonService.submitAppeal(req.params.id);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

module.exports = router;
