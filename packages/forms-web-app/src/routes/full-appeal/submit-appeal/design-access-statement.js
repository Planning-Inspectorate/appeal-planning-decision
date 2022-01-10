const express = require('express');
const {
  getDesignAccessStatement,
  postDesignAccessStatement,
} = require('../../../controllers/full-appeal/submit-appeal/design-access-statement');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: fileUploadValidationRules } = require('../../../validators/common/file-upload');

const router = express.Router();

router.get(
  '/submit-appeal/design-access-statement',
  [fetchExistingAppealMiddleware],
  getDesignAccessStatement
);
router.post(
  '/submit-appeal/design-access-statement',
  fileUploadValidationRules('Select your design and access statement'),
  validationErrorHandler,
  postDesignAccessStatement
);

module.exports = router;
