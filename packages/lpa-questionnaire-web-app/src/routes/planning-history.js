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
    sectionName: 'optionalDocumentsSection',
    taskName: 'planningHistory',
    view: VIEW.PLANNING_HISTORY,
    name: 'Planning history',
  };

  next();
};

router.get(
  '/:id/planning-history',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, clearUploadedFilesMiddleware],
  getConfig,
  uploadQuestionController.getUpload
);

router.post(
  '/:id/planning-history',
  [reqFilesToReqBodyFilesMiddleware('documents'), uploadValidationRules()],
  validationErrorHandler,
  getConfig,
  uploadQuestionController.postUpload
);

module.exports = {
  router,
  getConfig,
};
