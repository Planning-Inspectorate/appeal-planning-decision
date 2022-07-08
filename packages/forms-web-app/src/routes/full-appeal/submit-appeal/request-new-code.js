const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../../controllers/full-appeal/submit-appeal/request-new-code');

const router = express.Router();

router.get('/submit-appeal/request-new-code', getRequestNewCode);
router.post('/submit-appeal/request-new-code', postRequestNewCode);

module.exports = router;
