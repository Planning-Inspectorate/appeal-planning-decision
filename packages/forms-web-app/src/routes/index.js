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
const rule6Appeals = require('./rule-6');
const debug = require('./debug');
const {
	getDocument,
	getAppellantSubmissionPDFV2,
	getSubmissionDocumentV2Url,
	getPublishedDocumentV2Url,
	getLPAQSubmissionPDFV2
} = require('../controllers/document');
const checkDecisionDateDeadline = require('#middleware/check-decision-date-deadline');
const checkAppealExists = require('#middleware/check-appeal-exists');
const checkDebugAllowed = require('#middleware/check-debug-allowed');
const checkLoggedIn = require('#middleware/check-logged-in');
const cacheBusting = require('#middleware/cache-busting');
const createApiClients = require('#middleware/create-api-clients');

router.use(cacheBusting);
router.use(createApiClients);

/// LPA ///
if (config.featureFlag.dashboardsEnabled) {
	router.use('/manage-appeals', lpaDashboard);
}

/// Rule 6 ///
if (config.featureFlag.rule6Enabled) {
	router.use('/rule-6', rule6Appeals);
}

/// General Pages ///
router.use('/', home);
router.use('/cookies', cookies);
router.use('/accessibility-statement', accessibility);
router.use('/error', error);
router.get('/health', (req, res) => {
	res.status(200).send({
		status: 'OK',
		uptime: process.uptime(),
		commit: config.gitSha
	});
});

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
if (config.featureFlag.dashboardsEnabled) {
	router.use('/appeals', checkLoggedIn, appeals);
}

router.use('/appeal-document/:appellantSubmissionId', checkLoggedIn, getAppellantSubmissionPDFV2);
//v2 lpaq submission pdf
router.use('/lpa-questionnaire-document/:caseReference', checkLoggedIn, getLPAQSubmissionPDFV2);
// v2 published BO documents, doesn't check logged in as some docs are public, checked in docs api
router.use('/published-document/:documentId', getPublishedDocumentV2Url);
// v1 appeals / questionnaires documents
router.use('/document/:appealOrQuestionnaireId/:documentId', checkLoggedIn, getDocument);
//v2 submission (appeals/questionnaires) documents routes
router.use('/document/:documentId', checkLoggedIn, getSubmissionDocumentV2Url);

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

module.exports = router;
