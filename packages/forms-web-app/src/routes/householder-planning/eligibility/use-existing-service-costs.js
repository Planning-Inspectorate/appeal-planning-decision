const express = require('express');
const useExistingServiceCosts = require('../../../controllers/householder-planning/eligibility/use-existing-service-costs');

const router = express.Router();

router.get('/use-existing-service-costs', useExistingServiceCosts.getUseExistingServiceCosts);

module.exports = router;
