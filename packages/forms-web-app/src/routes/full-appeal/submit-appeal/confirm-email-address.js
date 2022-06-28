const express = require('express');
const {
	getConfirmEmailAddress
} = require('../../../controllers/full-appeal/submit-appeal/confirm-email-address');

const router = express.Router();

router.get('/submit-appeal/confirm-email-address', getConfirmEmailAddress);

module.exports = router;
