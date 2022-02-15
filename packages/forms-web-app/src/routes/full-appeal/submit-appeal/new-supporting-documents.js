const express = require('express');
const {
  getNewSupportingDocuments,
  postNewSupportingDocuments,
} = require('../../../controllers/full-appeal/submit-appeal/new-supporting-documents');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'appealDocumentsSection';
const taskName = 'supportingDocuments';

router.get(
  '/submit-appeal/new-supporting-documents',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getNewSupportingDocuments
);
router.post(
  '/submit-appeal/new-supporting-documents',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select a supporting document'),
  validationErrorHandler,
  postNewSupportingDocuments
);

module.exports = router;
