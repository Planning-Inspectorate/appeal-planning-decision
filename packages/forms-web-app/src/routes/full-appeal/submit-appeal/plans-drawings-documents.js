const { documentTypes } = require('@pins/common');
const express = require('express');
const {
  getPlansDrawingsDocuments,
  postPlansDrawingsDocuments,
} = require('../../../controllers/full-appeal/submit-appeal/plans-drawings-documents');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.plansDrawingsSupportingDocuments.name;

router.get(
  '/submit-appeal/plans-drawings-documents',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getPlansDrawingsDocuments
);
router.post(
  '/submit-appeal/plans-drawings-documents',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select your plans, drawings and supporting documents'),
  validationErrorHandler,
  postPlansDrawingsDocuments
);

module.exports = router;
