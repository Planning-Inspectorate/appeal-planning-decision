const express = require('express');
const indexController = require('../controllers');
const cookiePreferencesController = require('../controllers/cookies/cookie-preferences');

const router = express.Router();

/* GET home page. */
router.get('/', indexController.getIndex);
router.get('/cookies', cookiePreferencesController.getCookiePreferences);

module.exports = router;
