const express = require('express');

const router = express.Router();

const applicationNameRouter = require('./application-name');
const applicationNumberRouter = require('./application-number');
const checkAnswersRouter = require('./check-answers');
const confirmationRouter = require('./confirmation');
const eligibilityRouter = require('./eligibility');
const appellantSubmissionRouter = require('./appellant-submission');
const homeRouter = require('./home');
const submissionRouter = require('./submission');
const taskListRouter = require('./task-list');
const yourDetailsRouter = require('./your-details');

router.use('/', homeRouter);
router.use('/application-name', applicationNameRouter);
router.use('/application-number', applicationNumberRouter);
router.use('/check-answers', checkAnswersRouter);
router.use('/confirmation', confirmationRouter);
router.use('/eligibility', eligibilityRouter);
router.use('/appellant-submission', appellantSubmissionRouter);
router.use('/submission', submissionRouter);
router.use('/task-list', taskListRouter);
router.use('/your-details', yourDetailsRouter);

module.exports = router;
