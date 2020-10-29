const express = require('express');
const eligibilityController = require('../controllers/eligibility');

const router = express.Router();

/* GET eligibility no decision page. */
router.get('/no-decision', eligibilityController.getNoDecision);

/* GET eligibility decision date page. */
router.get('/decision-date', eligibilityController.getDecisionDate);

/* GET eligibility decision date expired page. */
router.get('/decision-date-expired', eligibilityController.getDecisionDateExpired);

module.exports = router;
