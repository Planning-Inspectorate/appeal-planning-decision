const express = require('express');
const grantedOrRefusedRouter = require('./granted-or-refused');
const outOfTimeRouter = require('./you-cannot-appeal');
const decisionDateRouter = require('./decision-date');
const dateDecisionDueRouter = require('./date-decision-due');
const priorApprovalExistingHomeRouter = require('./prior-approval-existing-home');
const listedBuildingRouter = require('./listed-building');

const router = express.Router();

router.use(grantedOrRefusedRouter);
router.use(outOfTimeRouter);
router.use(decisionDateRouter);
router.use(dateDecisionDueRouter);
router.use(priorApprovalExistingHomeRouter);
router.use(listedBuildingRouter);

module.exports = router;
