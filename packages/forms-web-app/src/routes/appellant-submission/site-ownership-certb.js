const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const siteOwnershipCertBController = require('../../controllers/appellant-submission/site-ownership-certb');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const {
  rules: siteOwnershipCertBValidationRules,
} = require('../../validators/appellant-submission/site-ownership-certb');

const router = express.Router();

router.get(
  '/site-ownership-certb',
  [fetchExistingAppealMiddleware],
  siteOwnershipCertBController.getSiteOwnershipCertB
);

router.post(
  '/site-ownership-certb',
  siteOwnershipCertBValidationRules(),
  validationErrorHandler,
  siteOwnershipCertBController.postSiteOwnershipCertB
);

module.exports = router;
