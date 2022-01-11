const express = require('express');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const fullAppealAppellantSubmissionRouter = require('./full-appeal/submit-appeal');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const fullAppealRouter = require('./full-appeal');
const householderPlanningRouter = require('./householder-planning');
const cookieRouter = require('./cookies');
const guidancePagesRouter = require('./guidance-pages');
const yourPlanningAppealRouter = require('./your-planning-appeal');
const documentRouter = require('./document');
const checkDecisionDateDeadline = require('../middleware/check-decision-date-deadline');

router.use('/', homeRouter);
router.use(guidancePagesRouter);
router.use('/cookies', cookieRouter);
router.use('/appellant-submission', checkDecisionDateDeadline, appellantSubmissionRouter);
router.use('/full-appeal', checkDecisionDateDeadline, fullAppealAppellantSubmissionRouter);
router.use('/eligibility', checkDecisionDateDeadline, eligibilityRouter);
router.use('/your-planning-appeal', yourPlanningAppealRouter);
router.use('/before-you-start', fullAppealRouter);
router.use('/before-you-start', householderPlanningRouter);
router.use('/document', documentRouter);
router.use('/before-you-start', householderPlanningRouter);

module.exports = router;
