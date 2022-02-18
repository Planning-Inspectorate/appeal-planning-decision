const express = require('express');
const healthSafetyController = require('../controllers/health-safety');
const fetchExistingAppealReplyMiddleware = require('../middleware/common/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/common/fetch-appeal');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: healthSafetyValidationRules } = require('../validators/health-safety');
const alreadySubmittedMiddleware = require('../middleware/already-submitted');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/health-safety',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
  healthSafetyController.getHealthSafety
);

router.post(
  '/appeal-questionnaire/:id/health-safety',
  healthSafetyValidationRules(),
  validationErrorHandler,
  healthSafetyController.postHealthSafety
);

module.exports = router;
