const express = require('express');
const cookiePreferencesController = require('../controllers/cookies/cookie-preferences');

const router = express.Router();

router.get('/', cookiePreferencesController.getCookiePreferences);
router.post('/', cookiePreferencesController.postCookiePreferences);

module.exports = router;
