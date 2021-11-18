const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const localPlanningDepartmentController = require('../../controllers/full-planning/local-planning-department');
const {
  rules: localPlanningDepartmentValidationRules,
} = require('../../validators/full-planning/local-planning-department');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/before-you-start/local-planning-depart',
  [fetchExistingAppealMiddleware],
  localPlanningDepartmentController.getPlanningDepartment
);

router.post(
  '/before-you-start/local-planning-depart',
  localPlanningDepartmentValidationRules(),
  validationErrorHandler,
  localPlanningDepartmentController.postPlanningDepartment
);

module.exports = router;
