const express = require('express');
const router = express.Router();

const ForManualInterventionService = require('../services/for-manual-intervention.service');

const forManualInterventionService = new ForManualInterventionService();

router.get('/appeals/:id', async (req, res) => {
	let statusCode = 202;
	let body = {};
	try {
		body = await forManualInterventionService.getAppealForManualIntervention(req.params.id);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

router.get('/appeals', async (req, res) => {
	let statusCode = 202;
	let body = {};
	try {
		body = await forManualInterventionService.getAllAppealsForManualIntervention();
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

module.exports = router;
