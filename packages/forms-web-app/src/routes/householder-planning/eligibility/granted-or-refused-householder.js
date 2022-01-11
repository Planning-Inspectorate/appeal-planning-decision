const express = require('express');

const grantedOrRefusedHouseholderController = require('../../../controllers/householder-planning/eligibility/granted-or-refused-householder');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: householderPlanningApplicationStatusRules,
} = require('../../../validators/householder-planning/eligibility/granted-or-refused-householder');

const router = express.Router();

router.get(
  '/granted-or-refused-householder',
  fetchExistingAppealMiddleware,
  grantedOrRefusedHouseholderController.getGrantedOrRefusedHouseholder
);

router.post(
  '/granted-or-refused-householder',
  householderPlanningApplicationStatusRules(),
  validationErrorHandler,
  grantedOrRefusedHouseholderController.postGrantedOrRefusedHouseholder
);

module.exports = router;
