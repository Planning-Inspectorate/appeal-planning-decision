const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const yourDetailsController = require('../../controllers/appellant-submission/your-details');
const { rules: yourDetailsRules } = require('../../validators/appellant-submission/your-details');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get('/your-details', [fetchExistingAppealMiddleware], yourDetailsController.getYourDetails);
router.post(
	'/your-details',
	[yourDetailsRules(), validationErrorHandler],
	yourDetailsController.postYourDetails
);

module.exports = router;
