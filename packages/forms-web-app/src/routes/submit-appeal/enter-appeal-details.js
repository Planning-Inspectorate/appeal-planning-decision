const express = require('express');
const enterAppealDetailsController = require('../../controllers/submit-appeal/enter-appeal-details');
const { rules: validateEmailAddressRules } = require('../../validators/common/email-address');
const {
  rules: validatePlanningApplicationNumberRules,
} = require('../../validators/common/application-number');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get('/enter-appeal-details', enterAppealDetailsController.getEnterAppealDetails);

router.post(
  '/enter-appeal-details',
  validateEmailAddressRules(),
  validatePlanningApplicationNumberRules(),
  validationErrorHandler,
  enterAppealDetailsController.postEnterAppealDetails
);

module.exports = router;
