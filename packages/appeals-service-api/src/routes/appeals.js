const express = require('express');

const { updateAppeal, getAppeal, createAppeal } = require('../controllers/appeals');

const router = express.Router();

router.get('/:id', getAppeal);

router.post('/', createAppeal);

router.put('/:id', updateAppeal);

router.patch('/:id', updateAppeal);

module.exports = router;
