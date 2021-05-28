const express = require('express');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { VIEW } = require('../lib/views');
const uploadQuestionController = require('../controllers/upload-question');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const clearUploadedFilesMiddleware = require('../middleware/clear-uploaded-files');
const uploadValidationRules = require('../validators/upload-tasks');

const router = express.Router();

const getConfig = (_, res, next) => {
  res.locals.routeInfo = {
    sectionName: 'requiredDocumentsSection',
    taskName: 'plansDecision',
    view: VIEW.UPLOAD_PLANS,
    name: 'Upload Plans',
  };

  next();
};

router.get(
  '/:id/plans',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, clearUploadedFilesMiddleware],
  getConfig,
  uploadQuestionController.getUpload
);

router.post(
  '/:id/plans',
  [
    reqFilesToReqBodyFilesMiddleware('documents'),
    uploadValidationRules('Upload plans used to reach the decision'),
  ],
  validationErrorHandler,
  getConfig,
  uploadQuestionController.postUpload
);

module.exports = {
  router,
  getConfig,
};
