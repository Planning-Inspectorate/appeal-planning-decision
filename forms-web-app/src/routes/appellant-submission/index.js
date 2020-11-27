const express = require('express');

const router = express.Router();

const appealStatementRouter = require('./appeal-statement');
const applicantNameRouter = require('./applicant-name');
const applicationNumberRouter = require('./application-number');
const supportingDocumentsRouter = require('./supporting-documents');
const taskListRouter = require('./task-list');
const uploadApplicationRouter = require('./upload-application');
const uploadDecisionRouter = require('./upload-decision');
const whoAreYouRouter = require('./who-are-you');
const yourDetailsRouter = require('./your-details');

router.use(appealStatementRouter);
router.use(applicantNameRouter);
router.use(applicationNumberRouter);
router.use(supportingDocumentsRouter);
router.use(taskListRouter);
router.use(uploadApplicationRouter);
router.use(uploadDecisionRouter);
router.use(whoAreYouRouter);
router.use(yourDetailsRouter);

module.exports = router;
