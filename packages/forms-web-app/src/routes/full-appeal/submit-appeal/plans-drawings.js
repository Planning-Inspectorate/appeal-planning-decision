const express = require('express');
const {
  getPlansDrawings,
  postPlansDrawings,
} = require('../../../controllers/full-appeal/submit-appeal/plans-drawings');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'appealDocumentsSection';
const taskName = 'plansDrawings';

router.get(
  '/submit-appeal/plans-drawings',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getPlansDrawings
);
router.post(
  '/submit-appeal/plans-drawings',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select a plan or drawing'),
  validationErrorHandler,
  postPlansDrawings
);

module.exports = router;
