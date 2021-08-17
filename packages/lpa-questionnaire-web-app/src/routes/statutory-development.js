const express = require('express');
const { VIEW } = require('../lib/views');
const uploadQuestionController = require('../controllers/upload-question');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const clearUploadedFilesMiddleware = require('../middleware/clear-uploaded-files');
const uploadValidationRules = require('../validators/upload-tasks');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

const getConfig = (_, res, next) => {
  res.locals.routeInfo = {
    sectionName: 'optionalDocumentsSection',
    taskName: 'statutoryDevelopment',
    view: VIEW.STATUTORY_DEVELOPMENT,
    name: 'Statutory development plan policy',
  };

  next();
};

router.get(
  '/:id/statutory-development',
  [
    authenticate,
    fetchAppealMiddleware,
    fetchExistingAppealReplyMiddleware,
    clearUploadedFilesMiddleware,
  ],
  getConfig,
  uploadQuestionController.getUpload
);

router.post(
  '/:id/statutory-development',
  [authenticate, reqFilesToReqBodyFilesMiddleware('documents'), uploadValidationRules()],
  validationErrorHandler,
  getConfig,
  uploadQuestionController.postUpload
);

module.exports = {
  router,
  getConfig,
};
