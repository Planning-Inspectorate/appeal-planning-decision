const express = require('express');

const eligibilityRouter = require('./eligibility/index');

const router = express.Router();

router.use(eligibilityRouter);

module.exports = router;
