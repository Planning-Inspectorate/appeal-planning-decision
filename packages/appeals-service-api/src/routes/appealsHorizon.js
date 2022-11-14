const express = require('express');

const { updateAppeal } = require('../services/appeal.service');

const router = express.Router();

router.patch('/:id', updateAppeal);

module.exports = router;
