const express = require('express');
const { documentTypes } = require('@pins/common');
const { VIEW } = require('../lib/views');
const uploadQuestionController = require('../controllers/upload-question');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const clearUploadedFilesMiddleware = require('../middleware/clear-uploaded-files');
const alreadySubmittedMiddleware = require('../middleware/already-submitted');
const uploadValidationRules = require('../validators/upload-tasks');
const { validationErrorHandler } = require('../validators/validation-error-handler');

const router = express.Router();

const getConfig = (req, res, next) => {
  res.locals.routeInfo = {
    sectionName: 'optionalDocumentsSection',
    taskName: 'siteNotices',
    view: VIEW.SITE_NOTICES,
    name: 'Site notices',
  };
  req.documentType = documentTypes.siteNotices.name;

  next();
};

router.get(
  '/appeal-questionnaire/:id/site-notice',
  [
    fetchAppealMiddleware,
    fetchExistingAppealReplyMiddleware,
    clearUploadedFilesMiddleware,
    alreadySubmittedMiddleware,
  ],
  getConfig,
  uploadQuestionController.getUpload
);

router.post(
  '/appeal-questionnaire/:id/site-notice',
  [reqFilesToReqBodyFilesMiddleware('documents'), uploadValidationRules()],
  validationErrorHandler,
  getConfig,
  uploadQuestionController.postUpload
);

module.exports = {
  router,
  getConfig,
};
