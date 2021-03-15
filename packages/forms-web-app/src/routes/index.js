const express = require('express');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const cookieRouter = require('./cookies');
const guidancePagesRouter = require('./guidance-pages');

router.use('/', homeRouter);
router.use(guidancePagesRouter);
router.use('/cookies', cookieRouter);
router.use('/appeal-householder-decision', appellantSubmissionRouter);
router.use('/eligibility', eligibilityRouter);

module.exports = router;
