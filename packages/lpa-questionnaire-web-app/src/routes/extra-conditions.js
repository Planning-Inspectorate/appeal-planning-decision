const express = require('express');
const extraConditionsController = require('../controllers/extra-conditions');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { rules: extraConditionsValidationRules } = require('../validators/extra-conditions');

const router = express.Router();

router.get(
  '/:id/extra-conditions',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  extraConditionsController.getExtraConditions
);

router.post(
  '/:id/extra-conditions',
  extraConditionsValidationRules(),
  validationErrorHandler,
  extraConditionsController.postExtraConditions
);

module.exports = router;
