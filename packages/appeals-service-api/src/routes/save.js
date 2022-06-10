const express = require('express');

const { saveAndReturnCreate } = require('../controllers/save-and-return');

const router = express.Router();

router.post('/', saveAndReturnCreate);

module.exports = router;
