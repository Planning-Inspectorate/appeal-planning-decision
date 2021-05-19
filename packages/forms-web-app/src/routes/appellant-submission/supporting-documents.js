const express = require('express');

const supportingDocumentsController = require('../../controllers/appellant-submission/supporting-documents');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../../middleware/req-files-to-req-body-files');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
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
  [reqFilesToReqBodyFilesMiddleware('supporting-documents'), supportingDocumentsValidationRules()],
  validationErrorHandler,
  supportingDocumentsController.postSupportingDocuments
);

module.exports = router;
