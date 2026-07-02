const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const enforcementNoticeListedBuildingController = require('../../controllers/before-you-start/enforcement-notice-listed-building');

const router = express.Router();

router.get(
	'/enforcement-notice-listed-building',
	[fetchExistingAppealMiddleware],
	enforcementNoticeListedBuildingController.getEnforcementNoticeListedBuilding
);

module.exports = router;
