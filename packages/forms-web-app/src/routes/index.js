const express = require('express');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const applicationNumberRouter = require('./application-number');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const pdfRouter = require('./pdf');

router.use('/', homeRouter);
router.use('/appellant-submission', appellantSubmissionRouter);
router.use('/application-number', applicationNumberRouter);
router.use('/eligibility', eligibilityRouter);

router.use('/pdf', pdfRouter);

module.exports = router;
