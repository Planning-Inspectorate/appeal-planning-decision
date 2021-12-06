const express = require('express');
const localPlanningDepartmentRouter = require('./local-planning-department');
const enforcementNotice = require('./enforcement-notice');

const router = express.Router();
router.use(localPlanningDepartmentRouter);
router.use(enforcementNotice);

module.exports = router;
