const express = require('express');
const anyOfFollowingRouter = require('./any-of-following');
const grantedOrRefusedRouter = require('./granted-or-refused');
const useExistingServiceLocalPlanningDepartment = require('./use-existing-service-local-planning-department');
const outOfTimeRouter = require('./you-cannot-appeal');
const enforcementNoticeRouter = require('./enforcement-notice');
const decisionDateRouter = require('./decision-date');
const dateDecisionDueRouter = require('./date-decision-due');
const priorApprovalExistingHomeRouter = require('./prior-approval-existing-home');
const useExistingServiceEnforcementNotice = require('./use-existing-service-enforcement-notice');

const router = express.Router();

router.use(anyOfFollowingRouter);
router.use(grantedOrRefusedRouter);
router.use(useExistingServiceLocalPlanningDepartment);
router.use(outOfTimeRouter);
router.use(enforcementNoticeRouter);
router.use(decisionDateRouter);
router.use(dateDecisionDueRouter);
router.use(priorApprovalExistingHomeRouter);
router.use(useExistingServiceEnforcementNotice);

module.exports = router;
