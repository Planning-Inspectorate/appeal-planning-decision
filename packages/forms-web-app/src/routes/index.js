const express = require('express');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const fullPlanningAppellantSubmissionRouter = require('./full-planning/full-appeal');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const fullPlanningRouter = require('./full-planning');
const cookieRouter = require('./cookies');
const guidancePagesRouter = require('./guidance-pages');
const yourPlanningAppealRouter = require('./your-planning-appeal');
const householderPlanningRouter = require('./householder-planning');
const checkDecisionDateDeadline = require('../middleware/check-decision-date-deadline');

router.use('/', homeRouter);
router.use(guidancePagesRouter);
router.use('/cookies', cookieRouter);
router.use('/appellant-submission', checkDecisionDateDeadline, appellantSubmissionRouter);
router.use('/full-appeal', checkDecisionDateDeadline, fullPlanningAppellantSubmissionRouter);
router.use('/eligibility', checkDecisionDateDeadline, eligibilityRouter);
router.use('/your-planning-appeal', yourPlanningAppealRouter);
router.use('/before-you-start', fullPlanningRouter);
router.use('/before-you-start', householderPlanningRouter);

module.exports = router;
