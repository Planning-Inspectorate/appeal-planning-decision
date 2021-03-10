const express = require('express');
const whoAreYouController = require('../../controllers/appellant-submission/who-are-you');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: whoAreYouValidationRules,
} = require('../../validators/appellant-submission/who-are-you');

const router = express.Router();

router.get(
  '/original-applicant',
  [fetchExistingAppealMiddleware],
  whoAreYouController.getWhoAreYou
);
router.post(
  '/original-applicant',
  whoAreYouValidationRules(),
  validationErrorHandler,
  whoAreYouController.postWhoAreYou
);

module.exports = router;
