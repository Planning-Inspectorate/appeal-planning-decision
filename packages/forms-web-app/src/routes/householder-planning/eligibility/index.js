const express = require('express');

const router = express.Router();

const claimingCostsHouseholderRouter = require('./claiming-costs-householder');
const dateDecisionDueHouseholderRouter = require('./date-decision-due-householder');
const listedBuildingHouseholderRouter = require('./listed-building-householder');
const enforcementNoticeRouter = require('./enforcement-notice-householder');
const grantedOrRefusedRouter = require('./granted-or-refused-householder');
const decisionDateHouseholderRouter = require('./decision-date-householder');
const conditionsHouseholderPermissionRouter = require('./conditions-householder-permission');
const useExistingServiceCosts = require('./use-existing-service-costs');
const useExistingServiceEnforcementNotice = require('./use-existing-service-enforcement-notice');
const checkYourAnswers = require('../../before-you-start/can-use-service');

router.use(claimingCostsHouseholderRouter);
router.use(enforcementNoticeRouter);
router.use(grantedOrRefusedRouter);
router.use(listedBuildingHouseholderRouter);
router.use(dateDecisionDueHouseholderRouter);
router.use(decisionDateHouseholderRouter);
router.use(conditionsHouseholderPermissionRouter);
router.use(useExistingServiceCosts);
router.use(useExistingServiceEnforcementNotice);
router.use(checkYourAnswers);

module.exports = router;
