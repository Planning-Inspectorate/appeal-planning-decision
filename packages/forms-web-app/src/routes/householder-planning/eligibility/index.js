const express = require('express');

const router = express.Router();

const listedBuildingHouseholderRouter = require('./listed-building-householder');
const enforcementNoticeRouter = require('./enforcement-notice-householder');
const grantedOrRefusedRouter = require('./granted-or-refused-householder');
const decisionDateHouseholderRouter = require('./decision-date-householder');

router.use(listedBuildingHouseholderRouter);
router.use(enforcementNoticeRouter);
router.use(grantedOrRefusedRouter);
router.use(decisionDateHouseholderRouter);

module.exports = router;
