const express = require('express');
const router = express.Router();
const { isFeatureActive } = require('../configuration/featureFlag');

const BackOfficeService = require('../services/back-office.service');
const HorizonService = require('../services/horizon.service');

const backOfficeService = new BackOfficeService();
const horizonService = new HorizonService();

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

router.put(
	'/appeals/:appeal_id/documents/:document_id',
	async (req, res) => {
		let statusCode = 200;
		let body = '';
		
		if (isFeatureActive('send-appeal-direct-to-horizon-wrapper')) {
			try {
				body = await horizonService.uploadDocument(req.params.appeal_id, req.params.document_id);
			} catch (error) {
				statusCode = error.code;
				body = error.message.errors;
			} finally {
				res.status(statusCode).send(body);
			}
		} else {
			statusCode = 403;
			res.status(statusCode).send(body);
		}
	}
);

module.exports = router;
