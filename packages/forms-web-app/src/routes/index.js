const express = require('express');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const applicationNumberRouter = require('./application-number');
const checkAnswersRouter = require('./check-answers');
const confirmationRouter = require('./confirmation');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const submissionRouter = require('./submission');

router.use('/', homeRouter);
router.use('/appellant-submission', appellantSubmissionRouter);
router.use('/application-number', applicationNumberRouter);
router.use('/check-answers', checkAnswersRouter);
router.use('/confirmation', confirmationRouter);
router.use('/eligibility', eligibilityRouter);
router.use('/submission', submissionRouter);

module.exports = router;
