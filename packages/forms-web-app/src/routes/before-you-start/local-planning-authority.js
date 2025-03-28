const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const localPlanningDepartmentController = require('../../controllers/full-appeal/local-planning-department');
const {
	rules: localPlanningDepartmentValidationRules
} = require('../../validators/full-appeal/local-planning-department');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get(
	'/local-planning-authority',
	[fetchExistingAppealMiddleware],
	localPlanningDepartmentController.getPlanningDepartment
);

router.post(
	'/local-planning-authority',
	localPlanningDepartmentValidationRules(),
	validationErrorHandler,
	localPlanningDepartmentController.postPlanningDepartment
);

module.exports = router;
