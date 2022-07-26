const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const {
	getSentAnotherLink
} = require('../../controllers/appeal-householder-decision/sent-another-link');
const router = express.Router();

router.get('/sent-another-link', [fetchExistingAppealMiddleware], getSentAnotherLink);

module.exports = router;
