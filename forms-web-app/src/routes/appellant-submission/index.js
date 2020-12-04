const express = require('express');

const router = express.Router();

const appealStatementRouter = require('./appeal-statement');
const applicantNameRouter = require('./applicant-name');
const applicationNumberRouter = require('./application-number');
const siteLocationRouter = require('./site-location');
const siteOwnershipRouter = require('./site-ownership');
const supportingDocumentsRouter = require('./supporting-documents');
const taskListRouter = require('./task-list');
const uploadApplicationRouter = require('./upload-application');
const uploadDecisionRouter = require('./upload-decision');
const whoAreYouRouter = require('./who-are-you');
const yourDetailsRouter = require('./your-details');

router.use(appealStatementRouter);
router.use(applicantNameRouter);
router.use(applicationNumberRouter);
router.use(siteLocationRouter);
router.use(siteOwnershipRouter);
router.use(supportingDocumentsRouter);
router.use(taskListRouter);
router.use(uploadApplicationRouter);
router.use(uploadDecisionRouter);
router.use(whoAreYouRouter);
router.use(yourDetailsRouter);

module.exports = router;
