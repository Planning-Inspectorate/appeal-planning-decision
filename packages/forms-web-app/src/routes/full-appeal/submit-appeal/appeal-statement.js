const express = require('express');
const { documentTypes } = require('@pins/common');
const {
  getAppealStatement,
  postAppealStatement,
} = require('../../../controllers/full-appeal/submit-appeal/appeal-statement');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: appealStatementValidationRules,
} = require('../../../validators/common/appeal-statement');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'appealDocumentsSection';
const taskName = documentTypes.appealStatement.name;

router.get(
  '/submit-appeal/appeal-statement',
  [fetchExistingAppealMiddleware],
  setSectionAndTaskNames(sectionName, taskName),
  getAppealStatement
);
router.post(
  '/submit-appeal/appeal-statement',
  setSectionAndTaskNames(sectionName, taskName),
  appealStatementValidationRules('Select your appeal statement'),
  validationErrorHandler,
  postAppealStatement
);

module.exports = router;
