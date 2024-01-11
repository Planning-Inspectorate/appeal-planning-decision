const express = require('express');
const router = express.Router();

const checkDecisionDateDeadline = require('#middleware/check-decision-date-deadline');
const checkAppealExists = require('#middleware/check-appeal-exists');
const checkLoggedIn = require('#middleware/check-logged-in');

router.use(require('./cannot-appeal'));
router.use(require('./login'));

router.use(checkAppealExists, checkDecisionDateDeadline, require('./planning-application-number'));

// post login
router.use(checkLoggedIn, checkAppealExists, checkDecisionDateDeadline, require('./task-list'));
router.use(
	checkLoggedIn,
	checkAppealExists,
	checkDecisionDateDeadline,
	require('./email-address-confirmed')
);
router.use(
	checkLoggedIn,
	checkAppealExists,
	checkDecisionDateDeadline,
	require('./list-of-documents')
);
router.use(
	checkLoggedIn,
	checkAppealExists,
	checkDecisionDateDeadline,
	require('./application-saved')
);
router.use(checkLoggedIn, checkAppealExists, checkDecisionDateDeadline, require('./save'));

module.exports = router;
