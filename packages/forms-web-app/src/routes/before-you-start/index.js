const express = require('express');
const anyOfFollowingRouter = require('./any-of-following');
const localPlanningDepartmentRouter = require('./local-planning-department');

const router = express.Router();

router.use(localPlanningDepartmentRouter);
router.use('/any-of-following', anyOfFollowingRouter);

module.exports = router;
