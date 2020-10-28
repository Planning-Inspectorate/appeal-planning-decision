const express = require('express');
const eligibilityController = require('../controllers/eligibility');

const router = express.Router();

/* GET eligibility no decision page. */
router.get('/no-decision', eligibilityController.getNoDecision);

/* GET eligibility no decision page. */
router.get('/decision-date', (req, res) => {
  res.render('eligibility/decision-date');
});

module.exports = router;
