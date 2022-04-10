const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const planningDepartmentController = require('../../controllers/eligibility/planning-department');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: planningDepartmentValidationRules,
} = require('../../validators/eligibility/planning-department');

const router = express.Router();

router.get(
  '/planning-department',
  [fetchExistingAppealMiddleware],
  planningDepartmentController.getPlanningDepartment
);
router.get(
  '/planning-department-something-else',
  [fetchExistingAppealMiddleware],
  planningDepartmentController.getPlanningDepartmentOut
);
router.post(
  '/planning-department',
  planningDepartmentValidationRules(),
  validationErrorHandler,
  planningDepartmentController.postPlanningDepartment
);

module.exports = router;
