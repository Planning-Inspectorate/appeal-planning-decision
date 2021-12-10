const express = require('express');
const developmentPlanController = require('../controllers/development-plan');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const alreadySubmittedMiddleware = require('../middleware/already-submitted');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: developmentPlanValidationRules } = require('../validators/development-plan');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/development-plan',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
  developmentPlanController.getDevelopmentPlan
);

router.post(
  '/appeal-questionnaire/:id/development-plan',
  developmentPlanValidationRules(),
  validationErrorHandler,
  developmentPlanController.postDevelopmentPlan
);

module.exports = router;
