const express = require('express');

const router = express.Router();
const { PLANNING_OBLIGATION_STATUS } = require('@pins/business-rules/src/constants');
const planningObligationStatusController = require('../../../controllers/full-appeal/submit-appeal/planning-obligation-status');
const { rules: optionsValidationRules } = require('../../../validators/common/options');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');

router.get(
  '/submit-appeal/planning-obligation-status',
  planningObligationStatusController.getPlanningObligationStatus
);
router.post(
  '/submit-appeal/planning-obligation-status',
  optionsValidationRules({
    fieldName: 'planning-obligation-status',
    validOptions: Object.values(PLANNING_OBLIGATION_STATUS),
    emptyError: 'Select the status of your planning obligation',
  }),
  validationErrorHandler,
  planningObligationStatusController.postPlanningObligationStatus
);
module.exports = router;
