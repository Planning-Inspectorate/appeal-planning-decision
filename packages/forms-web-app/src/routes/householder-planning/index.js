/* eslint-disable import/no-unresolved */
const express = require('express');

const dateDecisionDueHouseholderRouter = require('./date-decision-due-householder');

const router = express.Router();

router.use(dateDecisionDueHouseholderRouter);

module.exports = router;
