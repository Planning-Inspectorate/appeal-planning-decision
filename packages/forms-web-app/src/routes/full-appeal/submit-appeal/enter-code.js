const express = require('express');

const {
	getEnterCode,
	postEnterCode
} = require('../../../controllers/full-appeal/submit-appeal/enter-code');

const router = express.Router();

router.get('/submit-appeal/enter-code/:token', getEnterCode);

router.post('/submit-appeal/enter-code', postEnterCode);

module.exports = router;
