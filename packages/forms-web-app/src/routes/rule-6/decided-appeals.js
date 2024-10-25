const express = require('express');
const router = express.Router();
const { getDecidedAppealsR6 } = require('../../controllers/rule-6/decided-appeals');
const requireRule6User = require('../../middleware//rule-6/require-user');

router.get('/decided-appeals', requireRule6User, getDecidedAppealsR6);

module.exports = router;
