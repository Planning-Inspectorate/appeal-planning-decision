const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../controllers/appeal-householder-decision/request-new-code');

const router = express.Router();

router.get('/request-new-code', getRequestNewCode);
router.post('/request-new-code', postRequestNewCode);

module.exports = router;
