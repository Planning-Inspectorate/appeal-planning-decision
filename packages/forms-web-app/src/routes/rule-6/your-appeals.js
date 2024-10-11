const express = require('express');
const router = express.Router();
const { getR6YourAppeals } = require('../../controllers/rule-6/your-appeals');
const checkLoggedIn = require('../../middleware/check-logged-in');

router.get('/your-appeals', checkLoggedIn, getR6YourAppeals);

module.exports = router;
