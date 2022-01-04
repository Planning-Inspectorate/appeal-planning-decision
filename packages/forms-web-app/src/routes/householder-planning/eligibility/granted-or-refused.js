const express = require('express');

const grantedOrRefusedController = require('../../../controllers/householder-planning/eligibility/granted-or-refused');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: householderPlanningApplicationStatusRules,
} = require('../../../validators/householder-planning/eligibility/granted-or-refused');

const router = express.Router();

router.get(
  '/granted-or-refused-householder',
  fetchExistingAppealMiddleware,
  grantedOrRefusedController.getGrantedOrRefused
);

router.post(
  '/granted-or-refused-householder',
  householderPlanningApplicationStatusRules(),
  validationErrorHandler,
  grantedOrRefusedController.postGrantedOrRefused
);

module.exports = router;
