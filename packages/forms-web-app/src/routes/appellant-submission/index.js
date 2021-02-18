const express = require('express');

const router = express.Router();

const appealStatementRouter = require('./appeal-statement');
const applicantNameRouter = require('./applicant-name');
const applicationNumberRouter = require('./application-number');
const siteAccessRouter = require('./site-access');
const siteAccessSafetyRouter = require('./site-access-safety');
const siteLocationRouter = require('./site-location');
const siteOwnershipRouter = require('./site-ownership');
const siteOwnershipCertBRouter = require('./site-ownership-certb');
const supportingDocumentsRouter = require('./supporting-documents');
const taskListRouter = require('./task-list');
const uploadApplicationRouter = require('./upload-application');
const uploadDecisionRouter = require('./upload-decision');
const whoAreYouRouter = require('./who-are-you');
const yourDetailsRouter = require('./your-details');
const checkAnswersRouter = require('./check-answers');
const submissionRouter = require('./submission');
const confirmationRouter = require('./confirmation');
const submissionInformationRouter = require('./submission-information');

router.use(appealStatementRouter);
router.use(applicantNameRouter);
router.use(applicationNumberRouter);
router.use(siteAccessRouter);
router.use(siteAccessSafetyRouter);
router.use(siteLocationRouter);
router.use(siteOwnershipRouter);
router.use(siteOwnershipCertBRouter);
router.use(supportingDocumentsRouter);
router.use(taskListRouter);
router.use(uploadApplicationRouter);
router.use(uploadDecisionRouter);
router.use(whoAreYouRouter);
router.use(yourDetailsRouter);
router.use(checkAnswersRouter);
router.use(confirmationRouter);
router.use(submissionRouter);
router.use(submissionInformationRouter);

module.exports = router;
