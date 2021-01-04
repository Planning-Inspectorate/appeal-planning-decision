const express = require('express');

const planningDepartmentController = require('../../controllers/eligibility/planning-department');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: planningDepartmentValidationRules,
} = require('../../validators/eligibility/planning-department');

const router = express.Router();

router.get('/planning-department', planningDepartmentController.getPlanningDepartment);
router.get('/planning-department-out', planningDepartmentController.getPlanningDepartmentOut);
router.post(
  '/planning-department',
  planningDepartmentValidationRules(),
  validationErrorHandler,
  planningDepartmentController.postPlanningDepartment
);

module.exports = router;
