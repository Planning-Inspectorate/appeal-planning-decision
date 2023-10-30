const express = require('express');
const router = express.Router();
const ApiError = require('../errors/apiError');

const BackOfficeService = require('../services/back-office.service');
const BackOfficeV2Service = require('../services/back-office-v2.service');

const backOfficeService = new BackOfficeService();
const backOfficeV2Service = new BackOfficeV2Service();

router.post('/appeals/:id', async (req, res) => {
	try {
		await backOfficeV2Service.submitAppeal(req.params.id);
		await backOfficeService.saveAppealForSubmission(req.params.id);
		return res.status(202).send({});
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		return res.status(error.code).send(error.message.errors);
	}
});

router.put('/appeals', async (req, res) => {
	await backOfficeService.submitAppeals();
	res.sendStatus(202);
});

router.get('/appeals/:id', async (req, res) => {
	try {
		let body = await backOfficeService.getAppealForSubmission(req.params.id);
		console.log(body);
		return res.status(202).send(body);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		return res.status(error.code).send(error.message.errors);
	}
});
module.exports = router;
