const express = require('express');
const { getYourAppeals } = require('../../controllers/lpa-dashboard/your-appeals');

const router = express.Router();

router.get('/your-appeals', getYourAppeals);

module.exports = router;
