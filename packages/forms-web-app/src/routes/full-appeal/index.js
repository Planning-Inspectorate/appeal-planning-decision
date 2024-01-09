const express = require('express');
const router = express.Router();

const checkDecisionDateDeadline = require('#middleware/check-decision-date-deadline');
const checkAppealExists = require('#middleware/check-appeal-exists');
const checkLoggedIn = require('#middleware/check-logged-in');

router.use(require('./login'));

/// final comment ///
/// todo: we will likely want to use the deadline checking middleware
/// when it has been refactored to work with final comments
/// as well as appeal objects
router.use('/submit-final-comment', require('./submit-final-comment'));

router.use(checkLoggedIn, checkAppealExists, checkDecisionDateDeadline, require('./submit-appeal'));

module.exports = router;
