const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const listedBuildingHouseholderController = require('../../../controllers/householder-planning/eligibility/listed-building-householder');
const {
  rules: listedBuildingControllerValidationRules,
} = require('../../../validators/householder-planning/eligibility/listed-building-householder');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/listed-building-householder',
  [fetchExistingAppealMiddleware],
  listedBuildingHouseholderController.getListedBuildingHouseholder
);

router.post(
  '/listed-building-householder',
  listedBuildingControllerValidationRules(),
  validationErrorHandler,
  listedBuildingHouseholderController.postListedBuildingHouseholder
);

module.exports = router;
