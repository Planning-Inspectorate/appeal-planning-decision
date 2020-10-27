const express = require('express');

const router = express.Router();

/* GET eligibility no decision page. */
router.get('/no-decision', (req, res) => {
  res.render('eligibility/no-decision');
});

module.exports = router;
