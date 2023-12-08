const express = require('express');
const { getDecidedAppeals } = require('../../controllers/lpa-dashboard/decided-appeals');

const router = express.Router();

router.get('/decided-appeals', getDecidedAppeals);

module.exports = router;
