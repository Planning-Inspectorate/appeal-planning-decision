const express = require('express');
const {
  getDraftPlanningObligation,
  postDraftPlanningObligation,
} = require('../../../controllers/full-appeal/submit-appeal/draft-planning-obligation');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'appealDocumentsSection';
const taskName = 'draftPlanningObligations';

router.get(
  '/submit-appeal/draft-planning-obligation',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getDraftPlanningObligation
);
router.post(
  '/submit-appeal/draft-planning-obligation',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select your draft planning obligation'),
  validationErrorHandler,
  postDraftPlanningObligation
);

module.exports = router;
