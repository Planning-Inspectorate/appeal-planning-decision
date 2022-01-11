const express = require('express');
const {
  getDecisionLetter,
  postDecisionLetter,
} = require('../../../controllers/full-appeal/submit-appeal/decision-letter');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');

const router = express.Router();

router.get('/submit-appeal/decision-letter', [fetchExistingAppealMiddleware], getDecisionLetter);
router.post(
  '/submit-appeal/decision-letter',
  fileUploadValidationRules('Select your decision letter'),
  validationErrorHandler,
  postDecisionLetter
);

module.exports = router;
