const express = require('express');
const healthSafetyController = require('../controllers/health-safety');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: healthSafetyValidationRules } = require('../validators/health-safety');

const router = express.Router();

router.get(
  '/:id/health-safety',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  healthSafetyController.getHealthSafety
);

router.post(
  '/:id/health-safety',
  healthSafetyValidationRules(),
  validationErrorHandler,
  healthSafetyController.postHealthSafety
);

module.exports = router;
