const express = require('express');
const uploadPlansController = require('../controllers/upload-plans');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const clearUploadedFilesMiddleware = require('../middleware/clear-uploaded-files');
const uploadPlansValidationRules = require('../validators/upload-plans');
const { validationErrorHandler } = require('../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/:id/plans',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, clearUploadedFilesMiddleware],
  uploadPlansController.getUploadPlans
);

router.post(
  '/:id/plans',
  [reqFilesToReqBodyFilesMiddleware('documents'), uploadPlansValidationRules()],
  validationErrorHandler,
  uploadPlansController.postUploadPlans
);

module.exports = router;
