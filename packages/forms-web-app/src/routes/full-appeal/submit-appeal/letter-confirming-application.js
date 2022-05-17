const express = require('express');
const { documentTypes } = require('@pins/common');
const {
  getLetterConfirmingApplication: getLetterConfirmingApplication,
  postLetterConfirmingApplication: postLetterConfirmingApplication,
} = require('../../../controllers/full-appeal/submit-appeal/letter-confirming-application');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'letterConfirmingApplicationSection';
const taskName = documentTypes.letterConfirmingApplication.name;

router.get(
  '/submit-appeal/letter-confirming-application',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getLetterConfirmingApplication
);

router.post(
  '/submit-appeal/letter-confirming-application',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select your letter confirming application file'),
  validationErrorHandler,
  postLetterConfirmingApplication
);

module.exports = router;