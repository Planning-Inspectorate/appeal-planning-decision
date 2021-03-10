const express = require('express');

const listedBuildingController = require('../../controllers/eligibility/listed-building');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: listedBuildingValidationRules,
} = require('../../validators/eligibility/listed-building');

const router = express.Router();

router.get(
  '/listed-building-out',
  listedBuildingController.getServiceNotAvailableForListedBuildings
);
router.get('/listed-building', listedBuildingController.getListedBuilding);
router.post(
  '/listed-building',
  listedBuildingValidationRules(),
  validationErrorHandler,
  listedBuildingController.postListedBuilding
);

module.exports = router;
