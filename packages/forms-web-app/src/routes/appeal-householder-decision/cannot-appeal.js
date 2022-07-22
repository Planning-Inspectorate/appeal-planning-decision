const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const cannotAppealController = require('../../controllers/appeal-householder-decision/cannot-appeal');
const router = express.Router();

router.get(
	'/cannot-appeal',
	[fetchExistingAppealMiddleware],
	cannotAppealController.getCannotAppeal
);

module.exports = router;
