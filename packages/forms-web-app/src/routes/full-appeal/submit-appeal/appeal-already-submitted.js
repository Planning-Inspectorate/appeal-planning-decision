const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const {
	getAppealAlreadySubmitted
} = require('../../../controllers/full-appeal/submit-appeal/appeal-already-submitted');
const router = express.Router();

router.get(
	'/submit-appeal/appeal-already-submitted',
	[fetchExistingAppealMiddleware],
	getAppealAlreadySubmitted
);

module.exports = router;
