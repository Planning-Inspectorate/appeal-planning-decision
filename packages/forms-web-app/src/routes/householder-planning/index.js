/* eslint-disable import/no-unresolved */
const express = require('express');

const router = express.Router();

const eligibility = require('./eligibility/index');

const dateDecisionDueHouseholderRouter = require('./date-decision-due-householder');

router.use('/', eligibility);
router.use(dateDecisionDueHouseholderRouter);

module.exports = router;
