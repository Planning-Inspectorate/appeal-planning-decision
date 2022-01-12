const express = require('express');
const applicantNameController = require('../../../controllers/full-appeal/submit-appeal/applicant-name');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: applicantNameValidationRules,
} = require('../../../validators/full-appeal/applicant-name');

const router = express.Router();

router.get(
  '/submit-appeal/applicant-name',
  [fetchExistingAppealMiddleware],
  applicantNameController.getApplicantName
);
router.post(
  '/submit-appeal/applicant-name',
  applicantNameValidationRules(),
  validationErrorHandler,
  applicantNameController.postApplicantName
);
module.exports = router;
