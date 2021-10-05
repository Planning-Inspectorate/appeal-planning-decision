const express = require('express');
const authenticationController = require('../../controllers/authentication');
const fetchLPA = require('../../middleware/fetch-lpa');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: yourEmailValidatorRules } = require('../../validators/email');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:lpaCode/authentication/your-email/:error(session-expired|link-expired)?',
  fetchLPA,
  authenticationController.showEnterEmailAddress
);
router.post(
  '/appeal-questionnaire/:lpaCode/authentication/your-email',
  yourEmailValidatorRules(),
  validationErrorHandler,
  fetchLPA,
  authenticationController.processEmailAddress
);
router.get(
  '/appeal-questionnaire/:lpaCode/authentication/confirm-email',
  fetchLPA,
  authenticationController.showEmailConfirmation
);

module.exports = router;
