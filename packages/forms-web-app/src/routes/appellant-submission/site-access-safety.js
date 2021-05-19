const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const siteAccessController = require('../../controllers/appellant-submission/site-access-safety');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const {
  rules: siteAccessValidationRules,
} = require('../../validators/appellant-submission/site-access-safety');

const router = express.Router();

router.get(
  '/site-access-safety',
  [fetchExistingAppealMiddleware],
  siteAccessController.getSiteAccessSafety
);
router.post(
  '/site-access-safety',
  siteAccessValidationRules(),
  validationErrorHandler,
  siteAccessController.postSiteAccessSafety
);

module.exports = router;
