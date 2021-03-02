const express = require('express');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const cookieRouter = require('./cookies');

router.use('/', homeRouter);
router.use('/cookies', cookieRouter);
router.use('/appellant-submission', appellantSubmissionRouter);
router.use('/eligibility', eligibilityRouter);

module.exports = router;
