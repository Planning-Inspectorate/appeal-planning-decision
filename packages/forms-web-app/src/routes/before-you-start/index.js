const express = require('express');

const localPlanningDepartmentRouter = require('./local-planning-department');
const typeOfPlanningApplicationRouter = require('./type-of-planning-application');
const enforcementNoticeRouter = require('./enforcement-notice');
const anyOfFollowingRouter = require('./any-of-following');
const useADifferentServiceRouter = require('./use-a-different-service');
const enforcementNotice = require('./enforcement-notice');
const anyOfFollowingRouter = require('./any-of-following');
const useADifferentServiceRouter = require('./use-a-different-service');
const enforcementNotice = require('./enforcement-notice');

const router = express.Router();

router.use(localPlanningDepartmentRouter);
router.use(typeOfPlanningApplicationRouter);
router.use('/any-of-following', anyOfFollowingRouter);
router.use(enforcementNoticeRouter);
router.use(useADifferentServiceRouter);
router.use(enforcementNotice);
router.use(useADifferentServiceRouter);
router.use(enforcementNotice);

module.exports = router;
