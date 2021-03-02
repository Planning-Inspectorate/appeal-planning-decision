const express = require('express');
const cookiePreferencesController = require('../controllers/cookies/cookie-preferences');

const router = express.Router();

/* GET home page. */
router.get('/', cookiePreferencesController.getCookiePreferences);

module.exports = router;
