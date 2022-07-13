const express = require('express');
const {
	getConfirmEmailAddress
} = require('../../controllers/appeal-householder-decision/confirm-email-address');

const router = express.Router();

router.get('/confirm-email-address', getConfirmEmailAddress);

module.exports = router;
