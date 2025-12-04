const express = require('express');

const router = express.Router();

const listedBuildingHouseholderRouter = require('./listed-building-householder');
const grantedOrRefusedRouter = require('./granted-or-refused-householder');
const decisionDateHouseholderRouter = require('./decision-date-householder');
const conditionsHouseholderPermissionRouter = require('./conditions-householder-permission');

router.use(grantedOrRefusedRouter);
router.use(listedBuildingHouseholderRouter);
router.use(decisionDateHouseholderRouter);
router.use(conditionsHouseholderPermissionRouter);

module.exports = router;
