const express = require('express');
const router = express.Router();
const ApiError = require('#errors/apiError');

const ForManualInterventionService = require('../services/for-manual-intervention.service');

const forManualInterventionService = new ForManualInterventionService();

router.get('/appeals/:id', async (req, res) => {
	try {
		const body = await forManualInterventionService.getAppealForManualIntervention(req.params.id);
		res.status(202).send(body);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		return res.status(error.code).send(error.errors);
	}
});

router.get('/appeals', async (req, res) => {
	try {
		const body = await forManualInterventionService.getAllAppealsForManualIntervention();
		res.status(202).send(body);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		return res.status(error.code).send(error.errors);
	}
});

module.exports = router;
