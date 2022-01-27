const express = require('express');
const accuracySubmissionController = require('../controllers/accuracy-submission');
const fetchExistingAppealReplyMiddleware = require('../middleware/common/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/common/fetch-appeal');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: accuracySubmissionValidationRules } = require('../validators/accuracy-submission');
const alreadySubmittedMiddleware = require('../middleware/already-submitted');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/accuracy-submission',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
  accuracySubmissionController.getAccuracySubmission
);

router.post(
  '/appeal-questionnaire/:id/accuracy-submission',
  accuracySubmissionValidationRules(),
  validationErrorHandler,
  accuracySubmissionController.postAccuracySubmission
);

module.exports = router;
