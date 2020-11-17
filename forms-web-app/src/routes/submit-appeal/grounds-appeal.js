const express = require('express');

const submitAppealController = require('../../controllers/submit-appeal/grounds-appeal');

const router = express.Router();

router.get('/grounds-of-appeal', submitAppealController.getGroundsOfAppeal);

module.exports = router;
