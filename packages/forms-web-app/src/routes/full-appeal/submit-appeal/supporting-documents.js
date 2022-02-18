const express = require('express');
const {
  getSupportingDocuments,
  postSupportingDocuments,
} = require('../../../controllers/full-appeal/submit-appeal/supporting-documents');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get(
  '/submit-appeal/supporting-documents',
  [fetchExistingAppealMiddleware],
  getSupportingDocuments
);
router.post(
  '/submit-appeal/supporting-documents',
  optionsValidationRules({
    fieldName: 'supporting-documents',
    emptyError: 'Select yes if you want to submit any new supporting documents with your appeal',
  }),
  validationErrorHandler,
  postSupportingDocuments
);

module.exports = router;
