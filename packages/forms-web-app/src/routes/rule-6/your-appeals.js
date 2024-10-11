const express = require('express');
const router = express.Router();
const { getR6YourAppeals } = require('../../controllers/rule-6/your-appeals');

router.get('/your-appeals', getR6YourAppeals);

module.exports = router;
