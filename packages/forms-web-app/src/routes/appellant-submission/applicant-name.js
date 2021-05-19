const express = require('express');
const applicantNameController = require('../../controllers/appellant-submission/applicant-name');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const {
  rules: applicantNameValidationRules,
} = require('../../validators/appellant-submission/applicant-name');

const router = express.Router();

router.get(
  '/applicant-name',
  [fetchExistingAppealMiddleware],
  applicantNameController.getApplicantName
);
router.post(
  '/applicant-name',
  applicantNameValidationRules(),
  validationErrorHandler,
  applicantNameController.postApplicantName
);
module.exports = router;
