const express = require('express');

const { patchAppeal } = require('../controllers/appeals');

const router = express.Router();

router.patch('/:id', patchAppeal);

module.exports = router;
