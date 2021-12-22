const express = require('express');
const {
  getApplicationForm,
  postApplicationForm,
} = require('../../../controllers/full-planning/full-appeal/application-form');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');

const router = express.Router();

router.get('/application-form', getApplicationForm);
router.post(
  '/application-form',
  fileUploadValidationRules(),
  validationErrorHandler,
  postApplicationForm
);

module.exports = router;
