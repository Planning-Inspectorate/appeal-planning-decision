const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const listedBuildingController = require('../../controllers/full-appeal/listed-building');
const {
	rules: listedBuildingControllerValidationRules
} = require('../../validators/full-appeal/listed-building');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get(
	'/listed-building',
	fetchExistingAppealMiddleware,
	listedBuildingController.getListedBuilding
);

router.post(
	'/listed-building',
	listedBuildingControllerValidationRules(),
	validationErrorHandler,
	listedBuildingController.postListedBuilding
);

module.exports = router;
