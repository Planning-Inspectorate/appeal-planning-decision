const express = require('express');
const router = express.Router();

const checkDecisionDateDeadline = require('#middleware/check-decision-date-deadline');
const checkAppealExists = require('#middleware/check-appeal-exists');
const checkLoggedIn = require('#middleware/check-logged-in');

router.use(require('./cannot-appeal'));
router.use(require('./login'));

// post login
router.use(
	checkLoggedIn,
	checkAppealExists,
	checkDecisionDateDeadline,
	require('./email-address-confirmed')
);

module.exports = router;
