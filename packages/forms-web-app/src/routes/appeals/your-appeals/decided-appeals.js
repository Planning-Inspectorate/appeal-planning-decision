const express = require('express');
const decidedAppealsController = require('../../../controllers/appeals/your-appeals/decided-appeals');

const router = express.Router();

router.get('/decided-appeals', decidedAppealsController.get);

module.exports = router;
