const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const localPlanningDepartmentController = require('../../controllers/before-you-start/local-planning-department');
const {
  rules: localPlanningDepartmentValidationRules,
} = require('../../validators/before-you-start/local-planning-department');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/local-planning-depart',
  [fetchExistingAppealMiddleware],
  localPlanningDepartmentController.getPlanningDepartment
);

router.post(
  '/local-planning-depart',
  localPlanningDepartmentValidationRules(),
  validationErrorHandler,
  localPlanningDepartmentController.postPlanningDepartment
);

module.exports = router;
