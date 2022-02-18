const {
  documentTypes: {
    draftStatementOfCommonGround: { name: taskName },
  },
} = require('@pins/common');
const express = require('express');
const {
  getDraftStatementCommonGround,
  postDraftStatementCommonGround,
} = require('../../../controllers/full-appeal/submit-appeal/draft-statement-common-ground');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'appealDecisionSection';

router.get(
  '/submit-appeal/draft-statement-common-ground',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getDraftStatementCommonGround
);
router.post(
  '/submit-appeal/draft-statement-common-ground',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select your draft statement of common ground'),
  validationErrorHandler,
  postDraftStatementCommonGround
);

module.exports = router;
