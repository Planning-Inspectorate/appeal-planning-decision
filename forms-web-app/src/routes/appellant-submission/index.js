const express = require('express');

const router = express.Router();

const appealStatementRouter = require('./appeal-statement');
const supportingDocumentsRouter = require('./supporting-documents');
const uploadApplicationRouter = require('./upload-application');
const uploadDecisionRouter = require('./upload-decision');
const taskListRouter = require('./task-list');
const whoAreYouRouter = require('./who-are-you');
const yourDetailsRouter = require('./your-details');
const applicantNameRouter = require('./applicant-name');

router.use(appealStatementRouter);
router.use(taskListRouter);
router.use(whoAreYouRouter);
router.use(yourDetailsRouter);
router.use(applicantNameRouter);
router.use(supportingDocumentsRouter);
router.use(uploadApplicationRouter);
router.use(uploadDecisionRouter);

module.exports = router;
