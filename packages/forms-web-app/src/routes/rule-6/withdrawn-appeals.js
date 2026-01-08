const express = require('express');
const withdrawnAppealsController = require('../../controllers/rule-6/withdrawn-appeals');
const requireRule6User = require('../../middleware/rule-6/require-user');
const router = express.Router();

router.get('/withdrawn-appeals', requireRule6User, withdrawnAppealsController.get);

module.exports = router;
