const express = require('express');
const { getLinkExpired } = require('../../controllers/appeal-householder-decision/link-expired');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');

const router = express.Router();

router.get('/link-expired', [fetchExistingAppealMiddleware], getLinkExpired);

module.exports = router;
