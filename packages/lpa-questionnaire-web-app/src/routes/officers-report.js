const express = require('express');
const { VIEW } = require('../lib/views');
const uploadQuestionController = require('../controllers/upload-question');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const uploadValidationRules = require('../validators/upload-tasks');
const { validationErrorHandler } = require('../validators/validation-error-handler');

const router = express.Router();

const getConfig = (_, res, next) => {
  res.locals.routeInfo = {
    sectionName: 'requiredDocumentsSection',
    taskName: 'officersReport',
    view: VIEW.OFFICERS_REPORT,
    name: 'Planning Officer’s report',
  };

  next();
};

router.get(
  '/:id/officers-report',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  getConfig,
  uploadQuestionController.getUpload
);

router.post(
  '/:id/officers-report',
  [
    reqFilesToReqBodyFilesMiddleware('documents'),
    uploadValidationRules('Upload the planning officer’s report or other documents and minutes'),
  ],
  validationErrorHandler,
  getConfig,
  uploadQuestionController.postUpload
);

module.exports = {
  router,
  getConfig,
};
