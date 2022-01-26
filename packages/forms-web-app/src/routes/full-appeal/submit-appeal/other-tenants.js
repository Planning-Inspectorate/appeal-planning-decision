const express = require('express');
const {
  getOtherTenants,
  postOtherTenants,
} = require('../../../controllers/full-appeal/submit-appeal/other-tenants');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get('/submit-appeal/other-tenants', [fetchExistingAppealMiddleware], getOtherTenants);
router.post(
  '/submit-appeal/other-tenants',
  optionsValidationRules({
    fieldName: 'other-tenants',
    emptyError: 'Select yes if there are any other tenants',
  }),
  validationErrorHandler,
  postOtherTenants
);

module.exports = router;
