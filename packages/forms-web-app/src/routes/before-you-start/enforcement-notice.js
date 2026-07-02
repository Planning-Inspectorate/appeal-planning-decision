const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const enforcementNoticeController = require('../../controllers/before-you-start/enforcement-notice');

const router = express.Router();

router.get(
	'/enforcement-notice',
	[fetchExistingAppealMiddleware],
	enforcementNoticeController.getEnforcementNotice
);

module.exports = router;
