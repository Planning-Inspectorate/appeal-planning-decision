const express = require('express');

const router = express.Router();

const homeRouter = require('./home');
const filesRouter = require('./files');
const taskListRouter = require('./task-list');
const accuracySubmissionRouter = require('./accuracy-submission');
const otherAppealsRouter = require('./other-appeals');
const extraConditionsRouter = require('./extra-conditions');
const developmentPlanRouter = require('./development-plan');
const { router: uploadPlansRouter } = require('./upload-plans');
const { router: officersReportRouter } = require('./officers-report');
const informationSubmittedRouter = require('./information-submitted');

router.use(homeRouter);
router.use(filesRouter);
router.use(taskListRouter);
router.use(accuracySubmissionRouter);
router.use(otherAppealsRouter);
router.use(extraConditionsRouter);
router.use(developmentPlanRouter);
router.use(uploadPlansRouter);
router.use(officersReportRouter);
router.use(informationSubmittedRouter);

module.exports = router;
