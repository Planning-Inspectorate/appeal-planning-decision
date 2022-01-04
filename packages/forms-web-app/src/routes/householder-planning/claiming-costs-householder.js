const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const claimingCostHouseholderController = require('../../controllers/householder-planning/claiming-costs-householder');
const {
  rules: claimingCostsControllerValidationRules,
} = require('../../validators/householder-planning/claiming-costs-householder');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/claiming-costs-householder',
  [fetchExistingAppealMiddleware],
  claimingCostHouseholderController.getClaimingCostsHouseholder
);

router.post(
  '/claiming-costs-householder',
  claimingCostsControllerValidationRules(),
  validationErrorHandler,
  claimingCostHouseholderController.postClaimingCostsHouseholder
);

module.exports = router;
