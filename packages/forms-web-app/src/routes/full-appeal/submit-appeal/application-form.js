const express = require('express');
const { documentTypes } = require('@pins/common');
const {
  getApplicationForm,
  postApplicationForm,
} = require('../../../controllers/full-appeal/submit-appeal/application-form');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.originalApplication.name;

router.get(
  '/submit-appeal/application-form',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getApplicationForm
);
router.post(
  '/submit-appeal/application-form',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select your planning application form'),
  validationErrorHandler,
  postApplicationForm
);

module.exports = router;
