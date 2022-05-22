const express = require('express');
const {
  getNewSupportingDocuments,
  postNewSupportingDocuments,
} = require('../../../controllers/full-appeal/submit-appeal/new-documents');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get(
  '/submit-appeal/new-documents',
  [fetchExistingAppealMiddleware],
  getNewSupportingDocuments
);
router.post(
  '/submit-appeal/new-documents',
  optionsValidationRules({
    fieldName: 'supporting-documents',
    emptyError: 'Select yes if you want to submit any new supporting documents with your appeal',
  }),
  validationErrorHandler,
  postNewSupportingDocuments
);

module.exports = router;
