const express = require('express');
const anyOfFollowingRouter = require('./any-of-following');
const grantedOrRefusedRouter = require('./granted-or-refused');
const outOfTimeRouter = require('./you-cannot-appeal');
const enforcementNoticeRouter = require('./enforcement-notice');
const decisionDateRouter = require('./decision-date');
const dateDecisionDueRouter = require('./date-decision-due');
const priorApprovalExistingHomeRouter = require('./prior-approval-existing-home');
const useExistingServiceEnforcementNotice = require('./use-existing-service-enforcement-notice');
const listedBuildingRouter = require('./listed-building');

const router = express.Router();

router.use(anyOfFollowingRouter);
router.use(grantedOrRefusedRouter);
router.use(outOfTimeRouter);
router.use(enforcementNoticeRouter);
router.use(decisionDateRouter);
router.use(dateDecisionDueRouter);
router.use(priorApprovalExistingHomeRouter);
router.use(useExistingServiceEnforcementNotice);
router.use(listedBuildingRouter);

module.exports = router;
