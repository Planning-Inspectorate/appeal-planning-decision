const express = require('express');

const router = express.Router();

const claimingCostsHouseholderRouter = require('./claiming-costs-householder');
const listedBuildingHouseholderRouter = require('./listed-building-householder');
const grantedOrRefusedRouter = require('./granted-or-refused-householder');
const decisionDateHouseholderRouter = require('./decision-date-householder');
const conditionsHouseholderPermissionRouter = require('./conditions-householder-permission');
const useExistingServiceCosts = require('./use-existing-service-costs');

router.use(claimingCostsHouseholderRouter);
router.use(grantedOrRefusedRouter);
router.use(listedBuildingHouseholderRouter);
router.use(decisionDateHouseholderRouter);
router.use(conditionsHouseholderPermissionRouter);
router.use(useExistingServiceCosts);

module.exports = router;
