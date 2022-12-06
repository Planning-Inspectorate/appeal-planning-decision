const express = require('express');
const router = express.Router();

const { HorizonService } = require('../services/horizon.service');

const horizonService = new HorizonService();

router.put('/appeals/:id', async (req, res) => {
	let statusCode = 200;
	let body = '';
	try {
		body = await horizonService.submitAppeal(req.params.id);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

module.exports = router;
