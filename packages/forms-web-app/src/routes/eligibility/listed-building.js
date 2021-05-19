const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const listedBuildingController = require('../../controllers/eligibility/listed-building');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const {
  rules: listedBuildingValidationRules,
} = require('../../validators/eligibility/listed-building');

const router = express.Router();

router.get('/listed-out', listedBuildingController.getServiceNotAvailableForListedBuildings);
router.get(
  '/listed-building',
  [fetchExistingAppealMiddleware],
  listedBuildingController.getListedBuilding
);
router.post(
  '/listed-building',
  listedBuildingValidationRules(),
  validationErrorHandler,
  listedBuildingController.postListedBuilding
);

module.exports = router;
