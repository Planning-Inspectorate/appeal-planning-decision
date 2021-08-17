const express = require('express');
const extraConditionsController = require('../controllers/extra-conditions');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: extraConditionsValidationRules } = require('../validators/extra-conditions');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get(
  '/:id/extra-conditions',
  [authenticate, fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  extraConditionsController.getExtraConditions
);

router.post(
  '/:id/extra-conditions',
  authenticate,
  extraConditionsValidationRules(),
  validationErrorHandler,
  extraConditionsController.postExtraConditions
);

module.exports = router;
