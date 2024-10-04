const express = require('express');
const router = express.Router();

const checkDecisionDateDeadline = require('#middleware/check-decision-date-deadline');
const checkAppealExists = require('#middleware/check-appeal-exists');
const checkLoggedIn = require('#middleware/check-logged-in');

router.use(require('./login'));

router.use(
	checkAppealExists,
	checkDecisionDateDeadline,
	require('./submit-appeal/planning-application-number')
);
router.use(checkLoggedIn, checkAppealExists, checkDecisionDateDeadline, require('./submit-appeal'));

module.exports = router;
