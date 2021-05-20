const express = require('express');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const filesController = require('../controllers/files');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const fileValidationRules = require('../validators/files');

const router = express.Router();

router.post(
  '/upload',
  [reqFilesToReqBodyFilesMiddleware('documents'), fileValidationRules()],
  validationErrorHandler,
  filesController.uploadFile
);
router.post('/delete', filesController.deleteFile);

module.exports = router;
