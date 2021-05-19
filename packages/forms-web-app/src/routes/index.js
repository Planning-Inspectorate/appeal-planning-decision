const express = require('express');
const {
  routes: { cookies: cookiesRouter },
} = require('@pins/common');

const router = express.Router();

const appellantSubmissionRouter = require('./appellant-submission');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const guidancePagesRouter = require('./guidance-pages');
const yourPlanningAppealRouter = require('./your-planning-appeal');

router.use('/', homeRouter);
router.use(guidancePagesRouter);
router.use('/cookies', cookiesRouter);
router.use('/appellant-submission', appellantSubmissionRouter);
router.use('/eligibility', eligibilityRouter);
router.use('/your-planning-appeal', yourPlanningAppealRouter);

module.exports = router;
