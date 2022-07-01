const express = require('express');

const {
	saveAndReturnGet,
	saveAndReturnCreate,
	saveAndReturnToken
} = require('../controllers/save');

const router = express.Router();

router.get('/:token', saveAndReturnGet);

router.post('/', saveAndReturnCreate);

router.patch('/:token', saveAndReturnToken);

module.exports = router;
