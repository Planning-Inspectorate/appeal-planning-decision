const express = require('express');
const addSupplementaryDocumentsController = require('../controllers/supplementary-documents/add-supplementary-documents');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const combineDateInputsMiddleware = require('../middleware/combine-date-inputs');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const supplementaryDocumentsValidationRules = require('../validators/supplementary-documents');

const router = express.Router();

router.get(
  '/:id/supplementary-documents/add-document',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  addSupplementaryDocumentsController.getAddDocument
);

router.post(
  '/:id/supplementary-documents/add-document',
  reqFilesToReqBodyFilesMiddleware('documents'),
  combineDateInputsMiddleware,
  supplementaryDocumentsValidationRules(),
  validationErrorHandler,
  addSupplementaryDocumentsController.postAddDocument
);

module.exports = router;
