const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const siteAccessController = require('../../controllers/appellant-submission/site-access');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const {
  rules: siteAccessValidationRules,
} = require('../../validators/appellant-submission/site-access');

const router = express.Router();

router.get('/site-access', [fetchExistingAppealMiddleware], siteAccessController.getSiteAccess);
router.post(
  '/site-access',
  siteAccessValidationRules(),
  validationErrorHandler,
  siteAccessController.postSiteAccess
);

module.exports = router;
