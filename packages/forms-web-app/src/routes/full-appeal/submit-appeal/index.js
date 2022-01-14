const express = require('express');
const taskListRouter = require('./task-list');
const checkAnswersRouter = require('./check-answers');
const contactDetailsRouter = require('./contact-details');
const applicationFormRouter = require('./application-form');
const applicationNumberRouter = require('./application-number');
const designAccessStatementRouter = require('./design-access-statement');
const appealSiteAddressRouter = require('./appeal-site-address');
const applicantNameRouter = require('./applicant-name');
const decisionLetterRouter = require('./decision-letter');
const appealStatementRouter = require('./appeal-statement');
const originalApplicantRouter = require('./original-applicant');

const router = express.Router();

router.use(taskListRouter);
router.use(checkAnswersRouter);
router.use(contactDetailsRouter);
router.use(applicationFormRouter);
router.use(applicationNumberRouter);
router.use(designAccessStatementRouter);
router.use(appealSiteAddressRouter);
router.use(applicantNameRouter);
router.use(decisionLetterRouter);
router.use(appealStatementRouter);
router.use(originalApplicantRouter);

module.exports = router;
