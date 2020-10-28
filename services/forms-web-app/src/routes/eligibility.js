const express = require('express');

const router = express.Router();

/* GET eligibility no decision page. */
router.get('/no-decision', (req, res) => {
  res.render('eligibility/no-decision');
});

/* GET eligibility no decision page. */
router.get('/decision-date', (req, res) => {
  res.render('eligibility/decision-date');
});

module.exports = router;
