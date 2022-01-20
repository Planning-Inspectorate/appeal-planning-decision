const express = require('express');
const { documentTypes } = require('@pins/common');
const {
  getDesignAccessStatement,
  postDesignAccessStatement,
} = require('../../../controllers/full-appeal/submit-appeal/design-access-statement');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.designAccessStatement.name;

router.get(
  '/submit-appeal/design-access-statement',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getDesignAccessStatement
);
router.post(
  '/submit-appeal/design-access-statement',
  setSectionAndTaskNames(sectionName, taskName),
  fileUploadValidationRules('Select your design and access statement'),
  validationErrorHandler,
  postDesignAccessStatement
);

module.exports = router;
