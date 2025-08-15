const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const {
	getEmailConfirmed
} = require('../../controllers/full-appeal/submit-appeal/email-address-confirmed');

const router = express.Router();

router.get('/email-address-confirmed', [fetchExistingAppealMiddleware], getEmailConfirmed);

module.exports = router;
