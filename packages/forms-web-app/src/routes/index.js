const express = require('express');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const cookieRouter = require('./cookies');
const guidancePagesRouter = require('./guidance-pages');
const yourPlanningAppealRouter = require('./your-planning-appeal');
const checkDecisionDateDeadline = require('../middleware/check-decision-date-deadline');

router.use('/', homeRouter);
router.use(guidancePagesRouter);
router.use('/cookies', cookieRouter);
router.use('/appellant-submission', checkDecisionDateDeadline, appellantSubmissionRouter);
router.use('/eligibility', checkDecisionDateDeadline, eligibilityRouter);
router.use('/your-planning-appeal', yourPlanningAppealRouter);

console.log(process.env);

module.exports = router;
