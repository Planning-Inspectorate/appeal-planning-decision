const express = require('express');
const addSupplementaryDocumentController = require('../controllers/supplementary-documents/add-supplementary-document');
const uploadedDocumentsController = require('../controllers/supplementary-documents/uploaded-documents');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const combineDateInputsMiddleware = require('../middleware/combine-date-inputs');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const supplementaryDocumentsValidationRules = require('../validators/supplementary-documents');

const router = express.Router();

router.get(
  '/:id/supplementary-documents',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  addSupplementaryDocumentController.getAddDocument
);

router.post(
  '/:id/supplementary-documents',
  reqFilesToReqBodyFilesMiddleware('documents'),
  combineDateInputsMiddleware,
  supplementaryDocumentsValidationRules(),
  validationErrorHandler,
  addSupplementaryDocumentController.postAddDocument
);

router.get(
  '/:id/supplementary-documents/uploaded-documents',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  uploadedDocumentsController.getUploadedDocuments
);

module.exports = router;
