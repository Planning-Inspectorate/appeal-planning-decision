const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const {
	getEmailConfirmed
} = require('../../../controllers/full-appeal/submit-appeal/email-confirmed');

const router = express.Router();

router.get(
	'/submit-appeal/email-address-confirmed/:token',
	[fetchExistingAppealMiddleware],
	getEmailConfirmed
);

module.exports = router;
