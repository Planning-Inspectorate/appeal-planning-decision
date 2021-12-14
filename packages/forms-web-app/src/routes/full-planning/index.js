const express = require('express');

const localPlanningDepartmentRouter = require('./local-planning-department');
const typeOfPlanningApplicationRouter = require('./type-of-planning-application');
const anyOfFollowingRouter = require('./any-of-following');
const useADifferentServiceRouter = require('./use-a-different-service');
const listedBuildingRouter = require('./listed-building');

const router = express.Router();

router.use(localPlanningDepartmentRouter);
router.use(typeOfPlanningApplicationRouter);
router.use(anyOfFollowingRouter);
router.use(useADifferentServiceRouter);
router.use(listedBuildingRouter);

module.exports = router;
