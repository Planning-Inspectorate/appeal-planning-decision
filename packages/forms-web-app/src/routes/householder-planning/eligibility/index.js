const express = require('express');

const router = express.Router();

const listedBuildingHouseholderRouter = require('./listed-building-householder');
const enforcementNoticeRouter = require('./enforcement-notice-householder');

router.use(listedBuildingHouseholderRouter);
router.use(enforcementNoticeRouter);

module.exports = router;
