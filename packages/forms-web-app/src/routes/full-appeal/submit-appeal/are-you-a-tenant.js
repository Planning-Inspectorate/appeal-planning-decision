const express = require('express');
const {
  getAreYouATenant,
  postAreYouATenant,
} = require('../../../controllers/full-appeal/submit-appeal/are-you-a-tenant');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get('/submit-appeal/are-you-a-tenant', [fetchExistingAppealMiddleware], getAreYouATenant);
router.post(
  '/submit-appeal/are-you-a-tenant',
  optionsValidationRules({
    fieldName: 'are-you-a-tenant',
    emptyError: 'Select yes if you are a tenant of the agricultural holding',
  }),
  validationErrorHandler,
  postAreYouATenant
);

module.exports = router;
