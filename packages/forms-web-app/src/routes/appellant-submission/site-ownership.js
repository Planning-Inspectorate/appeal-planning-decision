const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const siteOwnershipController = require('../../controllers/appellant-submission/site-ownership');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const {
  rules: siteOwnershipValidationRules,
} = require('../../validators/appellant-submission/site-ownership');

const router = express.Router();

router.get(
  '/site-ownership',
  [fetchExistingAppealMiddleware],
  siteOwnershipController.getSiteOwnership
);

router.post(
  '/site-ownership',
  siteOwnershipValidationRules(),
  validationErrorHandler,
  siteOwnershipController.postSiteOwnership
);

module.exports = router;
