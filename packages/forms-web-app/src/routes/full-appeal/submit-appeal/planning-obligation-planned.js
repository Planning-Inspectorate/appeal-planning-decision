const express = require('express');
const router = express.Router();

const planningObligationPlannedController = require('../../../controllers/full-appeal/submit-appeal/planning-obligation-planned.js');

const { validationErrorHandler } = require('../../../validators/validation-error-handler');

const { rules: optionsValidationRules } = require('../../../validators/common/options');

router.get(
  '/submit-appeal/planning-obligation-planned',
  planningObligationPlannedController.getPlanningObligationPlanned
);

router.post(
  '/submit-appeal/planning-obligation-planned',
  optionsValidationRules({
    validOptions: ['yes', 'no'],
    fieldName: 'plan-to-submit-planning-obligation',
    emptyError: 'Select yes if you plan to submit a planning obligation',
  }),
  validationErrorHandler,
  planningObligationPlannedController.postPlanningObligationPlanned
);

module.exports = router;
