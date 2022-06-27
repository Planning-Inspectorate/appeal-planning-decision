const express = require('express');

const { confirmEmailCreate } = require('../controllers/confirm-email');

const router = express.Router();

router.post('/', confirmEmailCreate);

module.exports = router;
