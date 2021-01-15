const express = require('express');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const applicationNumberRouter = require('./application-number');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');

router.use('/', homeRouter);
router.use('/appellant-submission', appellantSubmissionRouter);
router.use('/application-number', applicationNumberRouter);
router.use('/eligibility', eligibilityRouter);

module.exports = router;
