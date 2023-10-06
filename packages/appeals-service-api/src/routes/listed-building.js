const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');
const ApiError = require('../errors/apiError');
const listedBuildingService = require('../services/listed-building.service');

router.get('/:reference', async (req, res) => {
	let statusCode = 200;
	let body = {};
	try {
		body = await listedBuildingService.findListedBuilding(req.params.reference);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}

		logger.error(`Failed to get listed building: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	}

	res.status(statusCode).send(body);
});

router.put('/', async (req, res) => {
	let statusCode = 201;
	const listedBuildings = req.body;
	let body = {};

	try {
		if (Array.isArray(listedBuildings)) {
			await listedBuildingService.updateListedBuildings(listedBuildings);
		} else {
			await listedBuildingService.updateListedBuildings([listedBuildings]);
		}
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}

		logger.error(`Failed to post listed buildings: ${error.code}`);
		statusCode = error.code;
	}

	res.status(statusCode).send(body);
});

module.exports = router;
