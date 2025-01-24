const express = require('express');
const router = express.Router();
const ApiError = require('../errors/apiError');
const logger = require('../lib/logger');

const BackOfficeService = require('../services/back-office.service');
const backOfficeService = new BackOfficeService();

// const BackOfficeV2Service = require('../services/back-office-v2');
// const backOfficeV2Service = new BackOfficeV2Service();

router.post('/appeals/:id', async (req, res) => {
	try {
		// leaving commented out for now, not expecting to need to submit v1 appeals to new back office: AAPD-582 + AAPD-1535
		// await backOfficeV2Service.submitAppeal(req.params.id);
		await backOfficeService.saveAppealForSubmission(req.params.id);
		return res.status(202).send({});
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		return res.status(error.code).send(error.errors);
	}
});

router.put('/appeals', async (req, res) => {
	await backOfficeService.submitAppeals();
	res.sendStatus(202);
});

router.get('/appeals/:id', async (req, res) => {
	try {
		let body = await backOfficeService.getAppealForSubmission(req.params.id);
		logger.info({ body }, '/appeals/:id, backOfficeService.getAppealForSubmission');
		return res.status(202).send(body);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		return res.status(error.code).send(error.errors);
	}
});
module.exports = router;
