const express = require('express');

const { confirmEmailCreate, confirmEmailGet } = require('../controllers/confirm-email');

const router = express.Router();

router.get('/:id', confirmEmailGet);

router.post('/', confirmEmailCreate);

module.exports = router;
