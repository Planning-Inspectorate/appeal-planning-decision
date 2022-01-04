/* eslint-disable import/no-unresolved */
const express = require('express');

const claimingCostsHouseholderRouter = require('./claiming-costs-householder');

const router = express.Router();

router.use(claimingCostsHouseholderRouter);

module.exports = router;
