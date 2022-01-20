const { documentTypes } = require('@pins/common');
const express = require('express');
const {
  getDecisionLetter,
  postDecisionLetter,
} = require('../../../controllers/full-appeal/submit-appeal/decision-letter');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.decisionLetter.name;

router.get(
  '/submit-appeal/decision-letter',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getDecisionLetter
);
router.post(
  '/submit-appeal/decision-letter',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select your decision letter'),
  validationErrorHandler,
  postDecisionLetter
);

module.exports = router;
