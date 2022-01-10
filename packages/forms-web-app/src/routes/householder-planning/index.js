const express = require('express');

const router = express.Router();

const eligibility = require('./eligibility/index');

router.use('/', eligibility);

module.exports = router;
