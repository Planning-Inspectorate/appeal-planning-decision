const express = require('express');
const {
  validTellingTheTenantsOptions,
  getTellingTheTenants,
  postTellingTheTenants,
} = require('../../../controllers/full-appeal/submit-appeal/telling-the-tenants');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { buildCheckboxValidation } = require('../../../validators/common/checkboxes');

const router = express.Router();

const controllerUrl = '/submit-appeal/telling-the-tenants';

router.get(controllerUrl, [fetchExistingAppealMiddleware], getTellingTheTenants);

const errorMessage = `Confirm if you've told the tenants`;

const checkboxValidations = buildCheckboxValidation(
  'telling-the-tenants',
  validTellingTheTenantsOptions,
  {
    notEmptyMessage: errorMessage,
    allMandatoryMessage: errorMessage,
  }
);

router.post(controllerUrl, checkboxValidations, validationErrorHandler, postTellingTheTenants);

module.exports = router;
