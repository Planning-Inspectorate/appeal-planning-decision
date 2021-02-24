const express = require('express');
const accuracySubmissionController = require('../controllers/accuracy-submission');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');

const router = express.Router();

router.get(
  '/:id/accuracy-submission',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  accuracySubmissionController.getAccuracySubmission
);

module.exports = router;
