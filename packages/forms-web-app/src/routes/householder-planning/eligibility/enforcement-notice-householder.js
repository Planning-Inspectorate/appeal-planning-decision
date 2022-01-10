const express = require('express');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const enforcementNoticeController = require('../../../controllers/householder-planning/eligibility/enforcement-notice-householder');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: enforcementNoticeValidationRules,
} = require('../../../validators/householder-planning/eligibility/enforcement-notice-householder');

const router = express.Router();

router.get(
  '/enforcement-notice-householder',
  [fetchExistingAppealMiddleware],
  enforcementNoticeController.getEnforcementNotice
);
router.post(
  '/enforcement-notice-householder',
  enforcementNoticeValidationRules(),
  validationErrorHandler,
  enforcementNoticeController.postEnforcementNotice
);

module.exports = router;
