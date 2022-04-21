const express = require('express');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const fullAppealAppellantSubmissionRouter = require('./full-appeal/submit-appeal');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const fullAppealRouter = require('./full-appeal');
const beforeYouStartRouter = require('./before-you-start');

const householderPlanningRouter = require('./householder-planning');
const cookieRouter = require('./cookies');
const guidancePagesRouter = require('./guidance-pages');
const yourPlanningAppealRouter = require('./your-planning-appeal');
const documentRouter = require('./document');
const checkDecisionDateDeadline = require('../middleware/check-decision-date-deadline');
const checkAppealTypeExists = require('../middleware/check-appeal-type-exists');

router.use('/', homeRouter);
router.use(guidancePagesRouter);
router.use('/cookies', cookieRouter);
router.use(
  '/appellant-submission',
  checkAppealTypeExists,
  checkDecisionDateDeadline,
  appellantSubmissionRouter
);
router.use(
  '/full-appeal',
  checkAppealTypeExists,
  checkDecisionDateDeadline,
  fullAppealAppellantSubmissionRouter
);
router.use('/eligibility', checkDecisionDateDeadline, eligibilityRouter);
router.use('/your-planning-appeal', yourPlanningAppealRouter);
router.use('/before-you-start', checkAppealTypeExists, checkDecisionDateDeadline, fullAppealRouter);
router.use(
  '/before-you-start',
  checkAppealTypeExists,
  checkDecisionDateDeadline,
  householderPlanningRouter
);
router.use('/before-you-start', checkAppealTypeExists, checkDecisionDateDeadline, beforeYouStartRouter);

router.use('/document', documentRouter);

module.exports = router;
