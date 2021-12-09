const express = require('express');
const anyOfFollowingRouter = require('./any-of-following');
const localPlanningDepartmentRouter = require('./local-planning-department');
const typeOfPlanningApplicationRouter = require('./type-of-planning-application');
const enforcementNotice = require('./enforcement-notice');

const router = express.Router();

router.use(localPlanningDepartmentRouter);
router.use(typeOfPlanningApplicationRouter);
router.use('/any-of-following', anyOfFollowingRouter);
router.use(enforcementNotice);

module.exports = router;
