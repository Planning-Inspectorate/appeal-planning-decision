const express = require('express');
const {
  getAppealStatement,
  postAppealStatement,
} = require('../../../controllers/full-appeal/submit-appeal/appeal-statement');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: appealStatementValidationRules,
} = require('../../../validators/common/appeal-statement');

const router = express.Router();

router.get('/submit-appeal/appeal-statement', [fetchExistingAppealMiddleware], getAppealStatement);
router.post(
  '/submit-appeal/appeal-statement',
  appealStatementValidationRules('Select your appeal statement'),
  validationErrorHandler,
  postAppealStatement
);

module.exports = router;
