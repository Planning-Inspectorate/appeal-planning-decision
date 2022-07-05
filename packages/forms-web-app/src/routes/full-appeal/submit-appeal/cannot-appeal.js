const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const cannotAppealController = require('../../../controllers/full-appeal/submit-appeal/cannot-appeal');
const router = express.Router();

router.get(
	'/submit-appeal/cannot-appeal',
	[fetchExistingAppealMiddleware],
	cannotAppealController.getCannotAppeal
);

module.exports = router;
