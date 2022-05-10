const express = require('express');
const { documentTypes } = require('@pins/common');
const {
  getOriginalDecisionNotice,
  postOriginalDecisionNotice,
} = require('../../../controllers/full-appeal/submit-appeal/original-decision-notice');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.originalDecisionNotice.name;

router.get(
  '/submit-appeal/original-decision-notice',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getOriginalDecisionNotice
);

router.post(
  '/submit-appeal/original-decision-notice',
  setSectionAndTaskNames(sectionName, taskName),
  //   fileUploadValidationRules('Select your original decision notice file'),
  //   validationErrorHandler,
  postOriginalDecisionNotice
);

module.exports = router;
