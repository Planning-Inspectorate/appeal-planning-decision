const express = require('express');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');

router.use('/', homeRouter);
router.use('/appellant-submission', appellantSubmissionRouter);
router.use('/eligibility', eligibilityRouter);

module.exports = router;
