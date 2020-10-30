const express = require('express');
const eligibilityController = require('../controllers/eligibility');

const router = express.Router();

/* GET eligibility no decision page. */
router.get('/no-decision', eligibilityController.getNoDecision);

/* GET eligibility decision date input page. */
router.get('/decision-date', eligibilityController.getDecisionDate);
router.post('/decision-date', eligibilityController.postDecisionDate);

/* GET eligibility decision date out page. */
router.get('/decision-date-expired', eligibilityController.getDecisionDateExpired);

module.exports = router;
