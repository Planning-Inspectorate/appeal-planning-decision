const express = require('express');
const localPlanningDepartmentRouter = require('./local-planning-department');
const typeOfPlanningApplicationRouter = require('./type-of-planning-application');

const router = express.Router();
router.use(localPlanningDepartmentRouter);
router.use(typeOfPlanningApplicationRouter);

module.exports = router;
