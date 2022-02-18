const express = require('express');
const { documentTypes } = require('@pins/common');
const { VIEW } = require('../lib/views');
const uploadQuestionController = require('../controllers/upload-question');
const fetchExistingAppealReplyMiddleware = require('../middleware/common/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/common/fetch-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../middleware/req-files-to-req-body-files');
const clearUploadedFilesMiddleware = require('../middleware/clear-uploaded-files');
const alreadySubmittedMiddleware = require('../middleware/already-submitted');
const uploadValidationRules = require('../validators/upload-tasks');
const { validationErrorHandler } = require('../validators/validation-error-handler');

const router = express.Router();

const getConfig = (req, res, next) => {
  res.locals.routeInfo = {
    sectionName: 'requiredDocumentsSection',
    taskName: 'plansDecision',
    view: VIEW.UPLOAD_PLANS,
    name: 'Upload Plans',
  };
  req.documentType = documentTypes.decisionPlans.name;

  next();
};

router.get(
  '/appeal-questionnaire/:id/plans',
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
  '/appeal-questionnaire/:id/plans',
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
