const express = require('express');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const enforcementNoticeHouseholderController = require('../../../controllers/householder-planning/eligibility/enforcement-notice-householder');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: enforcementNoticeHouseholderValidationRules,
} = require('../../../validators/householder-planning/eligibility/enforcement-notice-householder');

const router = express.Router();

router.get(
  '/enforcement-notice-householder',
  [fetchExistingAppealMiddleware],
  enforcementNoticeHouseholderController.getEnforcementNoticeHouseholder
);
router.post(
  '/enforcement-notice-householder',
  enforcementNoticeHouseholderValidationRules(),
  validationErrorHandler,
  enforcementNoticeHouseholderController.postEnforcementNoticeHouseholder
);

module.exports = router;
