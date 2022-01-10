const express = require('express');
const {
  getApplicationForm,
  postApplicationForm,
} = require('../../../controllers/full-appeal/submit-appeal/application-form');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');

const router = express.Router();

router.get('/submit-appeal/application-form', [fetchExistingAppealMiddleware], getApplicationForm);
router.post(
  '/submit-appeal/application-form',
  fileUploadValidationRules('Select your planning application form'),
  validationErrorHandler,
  postApplicationForm
);

module.exports = router;
