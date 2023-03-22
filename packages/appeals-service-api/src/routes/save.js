const express = require('express');

const { saveAndReturnGet, saveAndReturnCreate } = require('../controllers/save');

const router = express.Router();

router.get('/:id', saveAndReturnGet);

router.post('/', saveAndReturnCreate);

module.exports = router;
