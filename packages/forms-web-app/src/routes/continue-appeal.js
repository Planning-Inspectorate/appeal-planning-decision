const express = require('express');
const { continueAppeal } = require('../controllers/save');

const router = express.Router();

router.get('/continue-appeal', continueAppeal);

module.exports = router;
