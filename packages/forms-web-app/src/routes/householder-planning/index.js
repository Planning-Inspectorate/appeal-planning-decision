/* eslint-disable import/no-unresolved */
const express = require('express');

const decisionDateHouseholderRouter = require('./decision-date-householder');

const router = express.Router();

router.use(decisionDateHouseholderRouter);

module.exports = router;
