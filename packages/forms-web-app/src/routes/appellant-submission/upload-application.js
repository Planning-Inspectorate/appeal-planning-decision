const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const uploadApplicationController = require('../../controllers/appellant-submission/upload-application');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: uploadApplicationValidationRules,
} = require('../../validators/appellant-submission/upload-application');

const router = express.Router();

router.get(
  '/upload-planning-application-form',
  [fetchExistingAppealMiddleware],
  uploadApplicationController.getUploadApplication
);
router.post(
  '/upload-planning-application-form',
  uploadApplicationValidationRules(),
  validationErrorHandler,
  uploadApplicationController.postUploadApplication
);

module.exports = router;
