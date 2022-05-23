const express = require('express');
const {
  getOtherSupportingDocuments,
  postOtherSupportingDocuments,
} = require('../../../controllers/full-appeal/submit-appeal/other-supporting-documents');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'appealDocumentsSection';
const taskName = 'supportingDocuments';

router.get(
  '/submit-appeal/other-supporting-documents',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getOtherSupportingDocuments
);
router.post(
  '/submit-appeal/other-supporting-documents',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select a supporting document'),
  validationErrorHandler,
  postOtherSupportingDocuments
);

module.exports = router;
