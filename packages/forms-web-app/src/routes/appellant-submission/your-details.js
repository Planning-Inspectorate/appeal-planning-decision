const express = require('express');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const yourDetailsController = require('../../controllers/appellant-submission/your-details');
const { rules: yourDetailsRules } = require('../../validators/appellant-submission/your-details');

const router = express.Router();

router.get('/your-details', [fetchExistingAppealMiddleware], yourDetailsController.getYourDetails);
router.post(
  '/your-details',
  [yourDetailsRules(), validationErrorHandler],
  yourDetailsController.postYourDetails
);

module.exports = router;
