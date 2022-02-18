const express = require('express');
const extraConditionsController = require('../controllers/extra-conditions');
const fetchExistingAppealReplyMiddleware = require('../middleware/common/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/common/fetch-appeal');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: extraConditionsValidationRules } = require('../validators/extra-conditions');
const alreadySubmittedMiddleware = require('../middleware/already-submitted');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/extra-conditions',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
  extraConditionsController.getExtraConditions
);

router.post(
  '/appeal-questionnaire/:id/extra-conditions',
  extraConditionsValidationRules(),
  validationErrorHandler,
  extraConditionsController.postExtraConditions
);

module.exports = router;
