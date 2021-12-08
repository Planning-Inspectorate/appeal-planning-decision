const express = require('express');
const anyOfFollowingRouter = require('./any-of-following');
const localPlanningDepartmentRouter = require('./local-planning-department');
const typeOfPlanningApplicationRouter = require('./type-of-planning-application');
const useADifferentServiceRouter = require('./use-a-different-service');

const router = express.Router();

router.use(localPlanningDepartmentRouter);
router.use(typeOfPlanningApplicationRouter);
router.use('/any-of-following', anyOfFollowingRouter);
router.use(useADifferentServiceRouter);

module.exports = router;
