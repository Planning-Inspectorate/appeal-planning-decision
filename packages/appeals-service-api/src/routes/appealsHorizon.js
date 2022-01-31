const express = require('express');

const appealsController = require('../controllers/appeals');

const router = express.Router();

router.patch('/:id', appealsController.updateAppeal);

module.exports = router;
