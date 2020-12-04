const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const siteOwnershipController = require('../../controllers/appellant-submission/site-ownership');

const router = express.Router();

router.get(
  '/site-ownership',
  [fetchExistingAppealMiddleware],
  siteOwnershipController.getSiteOwnership
);

module.exports = router;
