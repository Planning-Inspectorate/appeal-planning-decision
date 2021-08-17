const express = require('express');
const accuracySubmissionController = require('../controllers/accuracy-submission');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: accuracySubmissionValidationRules } = require('../validators/accuracy-submission');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get(
  '/:id/accuracy-submission',
  [authenticate, fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  accuracySubmissionController.getAccuracySubmission
);

router.post(
  '/:id/accuracy-submission',
  authenticate,
  accuracySubmissionValidationRules(),
  validationErrorHandler,
  accuracySubmissionController.postAccuracySubmission
);

module.exports = router;
