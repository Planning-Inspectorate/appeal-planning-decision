const express = require('express');
const localPlanningDepartmentRouter = require('./local-planning-department');

const router = express.Router();
router.use(localPlanningDepartmentRouter);

module.exports = router;
