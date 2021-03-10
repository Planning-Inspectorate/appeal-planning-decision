const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const siteLocationController = require('../../controllers/appellant-submission/site-location');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: siteLocationValidationRules,
} = require('../../validators/appellant-submission/site-location');

const router = express.Router();

router.get(
  '/address-appeal-site',
  [fetchExistingAppealMiddleware],
  siteLocationController.getSiteLocation
);
router.post(
  '/address-appeal-site',
  siteLocationValidationRules(),
  validationErrorHandler,
  siteLocationController.postSiteLocation
);

module.exports = router;
