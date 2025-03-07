const express = require('express');
const clearAppealSession = require('../../controllers/before-you-start/clear-appeal-session');

const router = express.Router();
router.get('/clear-appeal-session', clearAppealSession.clearAppealSession);

module.exports = router;
