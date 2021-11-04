const express = require('express');
const filesController = require('../controllers/files');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const fileValidationRules = require('../validators/files');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const documentTypeValidator = require('../validators/document-type');

const router = express.Router();

router.post(
  '/upload/:documentType',
  [reqFilesToReqBodyFilesMiddleware('documents'), fileValidationRules()],
  validationErrorHandler,
  documentTypeValidator,
  filesController.uploadFile
);

router.post('/delete', filesController.deleteFile);

module.exports = router;
