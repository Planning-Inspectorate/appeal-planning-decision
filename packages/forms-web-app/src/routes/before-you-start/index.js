const express = require('express');
const localPlanningDepartmentRouter = require('./local-planning-department');
const typeOfPlanningApplicationRouter = require('./type-of-planning-application');
const enforcementNotice = require('./enforcement-notice');

const router = express.Router();
router.use(localPlanningDepartmentRouter);
router.use(typeOfPlanningApplicationRouter);
router.use(enforcementNotice);

const router = express.Router();

module.exports = router;
