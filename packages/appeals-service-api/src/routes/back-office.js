const express = require('express');
const router = express.Router();
const { isFeatureActive } = require('../configuration/featureFlag');

const BackOfficeService = require('../services/back-office.service');
const HorizonService = require('../services/horizon.service');
const FailedHorizonUploadService = require('../services/failed-horizon-upload.service')

const backOfficeService = new BackOfficeService();
const horizonService = new HorizonService();
const failedHorizonUploadService = new FailedHorizonUploadService();

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

router.put(
	'/appeals/failed',
	async (req, res) => {
		let statusCode = 200;
		let body = '';
		// if (isFeatureActive('send-appeal-direct-to-horizon-wrapper')){
		// 	try {
		// 		body = await failedHorizonUploadService.createFailedHorizonUpload(req.params.id);

		// 	} catch (error) {
		// 		statusCode = error.code;
		// 		body = error.message.errors;
		// 	} finally {
		// 		res.status(statusCode).send(body);
		// 	}
		// } else {
		// 	statusCode = 403;
		// 	res.status(statusCode).send(body);
		// }
		console.log(statusCode)
		res.status(statusCode).send(body);
	}
);

module.exports = router;
