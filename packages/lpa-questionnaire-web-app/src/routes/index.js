const express = require('express');

const router = express.Router();

const homeRouter = require('./home');
const filesRouter = require('./files');
const taskListRouter = require('./task-list');
const confirmAnswersRouter = require('./confirm-answers');
const accuracySubmissionRouter = require('./accuracy-submission');
const otherAppealsRouter = require('./other-appeals');
const extraConditionsRouter = require('./extra-conditions');
const { router: representationsRouter } = require('./representations');
const { router: notifyingPartiesRouter } = require('./notifying-parties');
const developmentPlanRouter = require('./development-plan');
const { router: uploadPlansRouter } = require('./upload-plans');
const { router: officersReportRouter } = require('./officers-report');
const { router: planningHistoryRouter } = require('./planning-history');
const { router: otherPoliciesRouter } = require('./other-policies');
const informationSubmittedRouter = require('./information-submitted');

router.use(homeRouter);
router.use(filesRouter);
router.use(taskListRouter);
router.use(confirmAnswersRouter);
router.use(accuracySubmissionRouter);
router.use(otherAppealsRouter);
router.use(extraConditionsRouter);
router.use(representationsRouter);
router.use(notifyingPartiesRouter);
router.use(developmentPlanRouter);
router.use(uploadPlansRouter);
router.use(officersReportRouter);
router.use(planningHistoryRouter);
router.use(otherPoliciesRouter);
router.use(informationSubmittedRouter);

module.exports = router;
