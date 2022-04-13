const express = require('express');
const useExistingServiceEnforcementNotice = require('../../../controllers/householder-planning/eligibility/use-existing-service-enforcement-notice');

const router = express.Router();

router.get(
  '/use-existing-service-enforcement-notice',
  useExistingServiceEnforcementNotice.getUseExistingServiceEnforcementNotice
);

module.exports = router;
