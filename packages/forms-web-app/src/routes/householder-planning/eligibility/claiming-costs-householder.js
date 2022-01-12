const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const claimingCostsHouseholderController = require('../../../controllers/householder-planning/eligibility/claiming-costs-householder');
const {
  rules: claimingCostsControllerValidationRules,
} = require('../../../validators/householder-planning/eligibility/claiming-costs-householder');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/claiming-costs-householder',
  [fetchExistingAppealMiddleware],
  claimingCostsHouseholderController.getClaimingCostsHouseholder
);

router.post(
  '/claiming-costs-householder',
  claimingCostsControllerValidationRules(),
  validationErrorHandler,
  claimingCostsHouseholderController.postClaimingCostsHouseholder
);

module.exports = router;
