const express = require('express');

const router = express.Router();

const appealStatementRouter = require('./appeal-statement');
const decisionDateRouter = require('./decision-date');
const enforcementNoticeRouter = require('./enforcement-notice');
const householderPlanningPermissionRouter = require('./householder-planning-permission');
const grantedOrRefusedPermissionRouter = require('./granted-or-refused-permission');
const listedBuildingRouter = require('./listed-building');
const costsRouter = require('./costs');
const planningDepartmentRouter = require('./planning-department');

router.use(appealStatementRouter);
router.use(decisionDateRouter);
router.use(enforcementNoticeRouter);
router.use(householderPlanningPermissionRouter);
router.use(grantedOrRefusedPermissionRouter);
router.use(listedBuildingRouter);
router.use(costsRouter);
router.use(planningDepartmentRouter);

module.exports = router;
