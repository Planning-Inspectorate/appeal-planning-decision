const express = require('express');

const router = express.Router();

const beforeYouStartRouter = require('./before-you-start/index');
const appellantSubmissionRouter = require('./appellant-submission');
const fullAppealRouter = require('./full-appeal/submit-appeal');
const eligibilityRouter = require('./eligibility');
const homeRouter = require('./home');
const fullAppealBeforeYouStartRouter = require('./full-appeal');
const householderPlanningRouter = require('./householder-planning');
const cookieRouter = require('./cookies');
const guidancePagesRouter = require('./guidance-pages');
const yourPlanningAppealRouter = require('./your-planning-appeal');
const documentRouter = require('./document');
const submitAppealRouter = require('./submit-appeal');
const saveAndReturnRouter = require('./save');
const saveAndReturnHasRouter = require('./appeal-householder-decision/save');
const appealHouseholderdecision = require('./appeal-householder-decision');
const checkDecisionDateDeadline = require('../middleware/check-decision-date-deadline');
const checkPathAllowed = require('../middleware/check-path-allowed');
const checkDebugAllowed = require('../middleware/check-debug-allowed');
const { skipMiddlewareForPaths } = require('../middleware/skip-middleware-for-paths');
const accessibilityStatementRouter = require('./accessibility-statement/accessibility-statement');
const errorPageRouter = require('./error');
const debugRouter = require('./debug');

router.use('/', homeRouter);
router.use(guidancePagesRouter);
router.use('/cookies', cookieRouter);
router.use('/accessibility-statement', accessibilityStatementRouter);
router.use('/error', errorPageRouter);
router.use(
	'/appellant-submission',
	checkPathAllowed,
	checkDecisionDateDeadline,
	appellantSubmissionRouter
);

router.use(
	'/full-appeal',
	skipMiddlewareForPaths(checkPathAllowed, ['submit-final-comment', 'enter-code']),
	//skipMiddlewareIfFinalComments(checkPathAllowed),
	//todo: we will likely want to use the deadline checking middleware
	//when it has been refactored to work with final comments
	//as well as appeal objects
	skipMiddlewareForPaths(checkDecisionDateDeadline, ['submit-final-comment']),
	//skipMiddlewareIfFinalComments(checkDecisionDateDeadline),
	fullAppealRouter
);

router.use('/eligibility', checkDecisionDateDeadline, eligibilityRouter);
router.use('/your-planning-appeal', yourPlanningAppealRouter);
router.use('/before-you-start', beforeYouStartRouter);
router.use(
	'/before-you-start',
	checkPathAllowed,
	checkDecisionDateDeadline,
	fullAppealBeforeYouStartRouter
);
router.use(
	'/before-you-start',
	checkPathAllowed,
	checkDecisionDateDeadline,
	householderPlanningRouter
);
router.use('/document', documentRouter);
router.use('/submit-appeal', checkPathAllowed, checkDecisionDateDeadline, submitAppealRouter);
router.use('/save-and-return', checkPathAllowed, checkDecisionDateDeadline, saveAndReturnRouter);

router.use(
	'/appeal-householder-decision/save-and-return',
	checkPathAllowed,
	checkDecisionDateDeadline,
	saveAndReturnHasRouter
);

router.use(
	'/appeal-householder-decision',
	skipMiddlewareForPaths(checkPathAllowed, ['enter-code']),
	checkDecisionDateDeadline,
	appealHouseholderdecision
);

router.use('/debug', checkDebugAllowed, debugRouter);

module.exports = router;
