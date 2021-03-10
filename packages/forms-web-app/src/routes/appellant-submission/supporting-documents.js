const express = require('express');

const supportingDocumentsController = require('../../controllers/appellant-submission/supporting-documents');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../../middleware/req-files-to-req-body-files');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: supportingDocumentsValidationRules,
} = require('../../validators/appellant-submission/supporting-documents');

const router = express.Router();

router.get(
  '/any-other-documents',
  [fetchExistingAppealMiddleware],
  supportingDocumentsController.getSupportingDocuments
);
router.post(
  '/any-other-documents',
  [reqFilesToReqBodyFilesMiddleware('supporting-documents'), supportingDocumentsValidationRules()],
  validationErrorHandler,
  supportingDocumentsController.postSupportingDocuments
);

module.exports = router;
