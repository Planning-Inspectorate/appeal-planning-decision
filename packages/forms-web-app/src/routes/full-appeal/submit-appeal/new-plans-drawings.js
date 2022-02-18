const express = require('express');
const {
  getNewPlansDrawings,
  postNewPlansDrawings,
} = require('../../../controllers/full-appeal/submit-appeal/new-plans-drawings');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'appealDocumentsSection';
const taskName = 'plansDrawings';

router.get(
  '/submit-appeal/new-plans-drawings',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getNewPlansDrawings
);
router.post(
  '/submit-appeal/new-plans-drawings',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select a plan or drawing'),
  validationErrorHandler,
  postNewPlansDrawings
);

module.exports = router;
