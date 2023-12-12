const express = require('express');
const yourAppealsController = require('../../controllers/appeals/your-appeals');

const router = express.Router();

router.get('/your-appeals', yourAppealsController.get);

module.exports = router;
