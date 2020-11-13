const express = require('express');
const fetchExistingAppealMiddleware = require('../middleware/fetch-existing-appeal');
const yourDetailsController = require('../controllers/your-details');
const { rules: yourDetailsRules } = require('../validators/your-details');
const { validationErrorHandler } = require('../validators/validation-error-handler');

const router = express.Router();

router.get('/', [fetchExistingAppealMiddleware], yourDetailsController.getYourDetails);
router.post(
  '/',
  [yourDetailsRules(), validationErrorHandler],
  yourDetailsController.postYourDetails
);

module.exports = router;
