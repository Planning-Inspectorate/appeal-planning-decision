const express = require('express');

const localPlanningDepartmentRouter = require('./local-planning-department');
const typeOfPlanningApplicationRouter = require('./type-of-planning-application');
const anyOfFollowingRouter = require('./any-of-following');
const useADifferentServiceRouter = require('./use-a-different-service');
const enforcementNoticeRouter = require('./enforcement-notice');

const router = express.Router();

router.use(localPlanningDepartmentRouter);
router.use(typeOfPlanningApplicationRouter);
router.use('/any-of-following', anyOfFollowingRouter);
router.use(useADifferentServiceRouter);
router.use(enforcementNoticeRouter);

module.exports = router;
