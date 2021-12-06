const express = require('express');
const localPlanningDepartmentRouter = require('./local-planning-department');
const useADifferentServiceRouter = require('./use-a-different-service');

const router = express.Router();
router.use(localPlanningDepartmentRouter);
router.use(useADifferentServiceRouter);

module.exports = router;
