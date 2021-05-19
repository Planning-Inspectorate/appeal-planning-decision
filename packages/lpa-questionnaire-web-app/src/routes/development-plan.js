const express = require('express');
const developmentPlanController = require('../controllers/development-plan');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { rules: developmentPlanValidationRules } = require('../validators/development-plan');

const router = express.Router();

router.get(
  '/:id/development-plan',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  developmentPlanController.getDevelopmentPlan
);

router.post(
  '/:id/development-plan',
  developmentPlanValidationRules(),
  validationErrorHandler,
  developmentPlanController.postDevelopmentPlan
);

module.exports = router;
