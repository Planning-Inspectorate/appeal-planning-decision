const express = require('express');
const addSupplementaryDocumentController = require('../controllers/supplementary-documents/add-supplementary-document');
const uploadedDocumentsController = require('../controllers/supplementary-documents/uploaded-documents');
const deleteSupplementaryDocumentController = require('../controllers/supplementary-documents/delete-supplementary-document');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const combineDateInputsMiddleware = require('../middleware/combine-date-inputs');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const supplementaryDocumentsValidationRules = require('../validators/supplementary-documents');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get(
  '/:id/supplementary-documents',
  [authenticate, fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  addSupplementaryDocumentController.getAddDocument
);

router.post(
  '/:id/supplementary-documents',
  authenticate,
  reqFilesToReqBodyFilesMiddleware('documents'),
  combineDateInputsMiddleware,
  supplementaryDocumentsValidationRules(),
  validationErrorHandler,
  addSupplementaryDocumentController.postAddDocument
);

router.get(
  '/:id/supplementary-documents/uploaded-documents',
  [authenticate, fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  uploadedDocumentsController.getUploadedDocuments
);

router.get(
  '/:id/supplementary-documents/delete-document',
  [authenticate, fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  deleteSupplementaryDocumentController.getDeleteDocument
);

router.post(
  '/:id/supplementary-documents/delete-document',
  [authenticate, fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  deleteSupplementaryDocumentController.postDeleteDocument
);

module.exports = router;
