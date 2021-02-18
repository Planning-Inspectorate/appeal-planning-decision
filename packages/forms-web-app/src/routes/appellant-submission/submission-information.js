const express = require('express');

const fetchAppealByUrlParam = require('../../middleware/fetch-appeal-by-url-param');
const fetchAppealLpdByAppealLpaCode = require('../../middleware/fetch-appeal-lpd-by-appeal-lpa-code');
const submissionInformationController = require('../../controllers/appellant-submission/submission-information');

const router = express.Router();

router.get(
  '/submission-information/:appealId',
  [fetchAppealByUrlParam('appealId'), fetchAppealLpdByAppealLpaCode],
  submissionInformationController.getSubmissionInformation
);

module.exports = router;
