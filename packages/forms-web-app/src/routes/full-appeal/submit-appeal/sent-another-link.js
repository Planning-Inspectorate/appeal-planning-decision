const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const {
	getSentAnotherLink
} = require('../../../controllers/full-appeal/submit-appeal/sent-another-link');
const router = express.Router();

router.get('/submit-appeal/sent-another-link', [fetchExistingAppealMiddleware], getSentAnotherLink);

module.exports = router;
