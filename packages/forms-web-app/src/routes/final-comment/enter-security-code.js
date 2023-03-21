const express = require('express');

const {
	getEnterSecurityCode,
	postEnterSecurityCode
} = require('../../controllers/final-comment/enter-security-code');

const router = express.Router();

router.get('/input-code', getEnterSecurityCode);
router.post('/input-code', postEnterSecurityCode);

module.exports = router;
