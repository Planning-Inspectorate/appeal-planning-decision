const express = require('express');

const supportingDocumentsController = require('../../controllers/appellant-submission/supporting-documents');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: supportingDocumentsValidationRules,
} = require('../../validators/appellant-submission/supporting-documents');

const router = express.Router();

router.get(
  '/supporting-documents',
  [fetchExistingAppealMiddleware],
  supportingDocumentsController.getSupportingDocuments
);
router.post(
  '/supporting-documents',
  supportingDocumentsValidationRules(),
  validationErrorHandler,
  supportingDocumentsController.postSupportingDocuments
);

module.exports = router;
