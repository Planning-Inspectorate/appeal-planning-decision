const express = require('express');
const eligibilityController = require('../controllers/eligibility');

const router = express.Router();

/* GET eligibility no decision page. */
router.get('/no-decision', eligibilityController.getNoDecision);

/* GET eligibility no decision page. */
router.get('/decision-date', (req, res) => {
  res.render('eligibility/decision-date');
});

/* GET eligibility applicant out page. */
router.get('/applicant-out', (req, res) => {
  res.render('eligibility/applicant-out');
});

module.exports = router;
