const express = require('express');

const {
  saveAndReturnGet,
  saveAndReturnCreate,
  saveAndReturnToken,
} = require('../controllers/save');

const router = express.Router();

router.get('/:appealId', saveAndReturnGet);

router.post('/', saveAndReturnCreate);

router.patch('/', saveAndReturnToken);

module.exports = router;
