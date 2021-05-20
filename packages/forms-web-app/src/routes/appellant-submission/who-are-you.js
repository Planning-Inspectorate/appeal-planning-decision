const express = require('express');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const whoAreYouController = require('../../controllers/appellant-submission/who-are-you');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const {
  rules: whoAreYouValidationRules,
} = require('../../validators/appellant-submission/who-are-you');

const router = express.Router();

router.get('/who-are-you', [fetchExistingAppealMiddleware], whoAreYouController.getWhoAreYou);
router.post(
  '/who-are-you',
  whoAreYouValidationRules(),
  validationErrorHandler,
  whoAreYouController.postWhoAreYou
);

module.exports = router;
