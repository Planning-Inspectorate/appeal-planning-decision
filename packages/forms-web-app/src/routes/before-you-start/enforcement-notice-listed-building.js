const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const enforcementNoticeListedBuildingController = require('../../controllers/before-you-start/enforcement-notice-listed-building');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: enforcementNoticeListedBuildingValidationRules
} = require('../../validators/before-you-start/enforcement-notice-listed-building');

const router = express.Router();

router.get(
	'/enforcement-notice-listed-building',
	[fetchExistingAppealMiddleware],
	enforcementNoticeListedBuildingController.getEnforcementNoticeListedBuilding
);
router.post(
	'/enforcement-notice-listed-building',
	[fetchExistingAppealMiddleware],
	enforcementNoticeListedBuildingValidationRules(),
	validationErrorHandler,
	enforcementNoticeListedBuildingController.postEnforcementNoticeListedBuilding
);

module.exports = router;
