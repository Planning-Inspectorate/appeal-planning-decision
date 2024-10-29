const express = require('express');
const router = express.Router();
const { getYourAppealsR6 } = require('../../controllers/rule-6/your-appeals');
const requireRule6User = require('../../middleware//rule-6/require-user');

router.get('/your-appeals', requireRule6User, getYourAppealsR6);

module.exports = router;
