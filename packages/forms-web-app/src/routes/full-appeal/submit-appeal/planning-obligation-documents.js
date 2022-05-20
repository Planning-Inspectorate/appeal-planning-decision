const express = require('express');
const {
  getPlanningObligationDocuments,
  postPlanningObligationDocuments,
} = require('../../../controllers/full-appeal/submit-appeal/planning-obligation-documents');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligations';

router.get(
  '/submit-appeal/planning-obligation',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getPlanningObligationDocuments
);
router.post(
  '/submit-appeal/planning-obligation',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select a supporting document'),
  validationErrorHandler,
  postPlanningObligationDocuments
);

module.exports = router;
