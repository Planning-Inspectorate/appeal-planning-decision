const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const {
	getEmailConfirmed,
	postEmailConfirmed
} = require('../../../controllers/full-appeal/submit-appeal/email-address-confirmed');

const router = express.Router();

router.get(
	'/submit-appeal/email-address-confirmed/:token',
	[fetchExistingAppealMiddleware],
	getEmailConfirmed
);
router.post('/submit-appeal/email-address-confirmed/:token', postEmailConfirmed);

module.exports = router;
