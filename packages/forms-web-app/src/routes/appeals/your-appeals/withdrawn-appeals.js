const express = require('express');
const withdrawnAppealsController = require('../../../controllers/appeals/your-appeals/withdrawn-appeals');
const router = express.Router();

router.get('/withdrawn-appeals', withdrawnAppealsController.get);

module.exports = router;
