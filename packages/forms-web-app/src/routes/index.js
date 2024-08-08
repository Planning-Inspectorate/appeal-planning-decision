const express = require('express');
const router = express.Router();
const config = require('../config');

const home = require('./home');
const cookies = require('./cookies');
const accessibility = require('./accessibility-statement/accessibility-statement');
const error = require('./error');
const sharedBFS = require('./before-you-start/index');
const fullAppealBFS = require('./full-appeal/before-you-start');
const hasAppealBFS = require('./householder-planning/before-you-start');
const householder = require('./appeal-householder-decision');
const fullAppeal = require('./full-appeal');
const appeal = require('./appeal/');
const appeals = require('./appeals/');
const save = require('./save');
const submit = require('./submit-appeal');
const submission = require('./appellant-submission');
const lpaDashboard = require('./lpa-dashboard');
const rule6Appeals = require('./rule-6-appeals');
const debug = require('./debug');
const {
	getDocument,
	getAppealPDFDocumentV2,
	getSubmissionDocumentV2Url,
	getPublishedDocumentV2Url
} = require('../controllers/document');
const checkDecisionDateDeadline = require('#middleware/check-decision-date-deadline');
const checkAppealExists = require('#middleware/check-appeal-exists');
const checkDebugAllowed = require('#middleware/check-debug-allowed');
const checkLoggedIn = require('#middleware/check-logged-in');
const createApiClients = require('#middleware/create-api-clients');

router.use(createApiClients);

/// LPA ///
if (config.dashboardsEnabled) {
	router.use('/manage-appeals', lpaDashboard);
}

/// Rule 6 ///
if (config.dashboardsEnabled) {
	router.use('/rule-6-appeals', rule6Appeals);
}

/// General Pages ///
router.use('/', home);
router.use('/cookies', cookies);
router.use('/accessibility-statement', accessibility);
router.use('/error', error);

/// before-you-start ///
router.use('/before-you-start', sharedBFS);
router.use('/before-you-start', checkAppealExists, checkDecisionDateDeadline, fullAppealBFS);
router.use('/before-you-start', checkAppealExists, checkDecisionDateDeadline, hasAppealBFS);

/// appeal-householder-decision ///
router.use('/appeal-householder-decision', householder);

/// full appeal ///
router.use('/full-appeal', fullAppeal);

/// appeal ///
router.use('/appeal', appeal);

/// post login shared appeals pages ///
if (config.dashboardsEnabled) {
	router.use('/appeals', checkLoggedIn, appeals);
}

//v2 submission pdf
router.use(
	'/appeal-document/:appealOrQuestionnaireId/:documentId',
	checkLoggedIn,
	getAppealPDFDocumentV2
);
// v2 published BO documents, doesn't check logged in as some docs are public, checked in docs api
router.use('/published-document/:documentId', getPublishedDocumentV2Url);
//v2 submission (appeals/questionnaires) documents routes
router.use('/document/:documentId', checkLoggedIn, getSubmissionDocumentV2Url);
// v1 appeals / questionnaires documents
router.use('/document/:appealOrQuestionnaireId/:documentId', checkLoggedIn, getDocument);

router.use('/save-and-return', checkLoggedIn, checkAppealExists, checkDecisionDateDeadline, save);
router.use('/submit-appeal', checkLoggedIn, checkAppealExists, checkDecisionDateDeadline, submit);
router.use(
	'/appellant-submission',
	checkLoggedIn,
	checkAppealExists,
	checkDecisionDateDeadline,
	submission
);

/// Local/Test only pages ///
router.use('/debug', checkDebugAllowed, debug);

/// Are these routes/controllers used? - believe we can potentially delete all subsequent logic ///
router.use(require('./guidance-pages'));
router.use('/your-planning-appeal', require('./your-planning-appeal'));
router.use('/eligibility', checkDecisionDateDeadline, require('./eligibility'));

module.exports = router;
