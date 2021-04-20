const express = require('express');
const filesController = require('../controllers/files');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const fileValidationRules = require('../validators/files');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');

const router = express.Router();

router.post(
  '/upload',
  [
    fetchAppealMiddleware,
    fetchExistingAppealReplyMiddleware,
    reqFilesToReqBodyFilesMiddleware('documents'),
    fileValidationRules(),
  ],
  validationErrorHandler,
  filesController.uploadFile
);
router.post(
  '/delete',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  filesController.deleteFile
);

module.exports = router;
