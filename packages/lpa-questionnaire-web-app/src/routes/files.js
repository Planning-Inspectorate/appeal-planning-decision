const express = require('express');
const filesController = require('../controllers/files');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const fileValidationRules = require('../validators/files');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post(
  '/upload',
  [authenticate, reqFilesToReqBodyFilesMiddleware('documents'), fileValidationRules()],
  validationErrorHandler,
  filesController.uploadFile
);
router.post('/delete', authenticate, filesController.deleteFile);

module.exports = router;
