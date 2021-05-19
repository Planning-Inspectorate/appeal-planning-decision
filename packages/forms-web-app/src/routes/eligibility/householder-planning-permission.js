const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const householderPlanningPermissionController = require('../../controllers/eligibility/householder-planning-permission');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const {
  rules: householderPlanningPermissionValidationRules,
} = require('../../validators/eligibility/householder-planning-permission');

const router = express.Router();

router.get(
  '/householder-planning-permission-out',
  householderPlanningPermissionController.getServiceOnlyForHouseholderPlanningPermission
);
router.get(
  '/householder-planning-permission',
  [fetchExistingAppealMiddleware],
  householderPlanningPermissionController.getHouseholderPlanningPermission
);
router.post(
  '/householder-planning-permission',
  householderPlanningPermissionValidationRules(),
  validationErrorHandler,
  householderPlanningPermissionController.postHouseholderPlanningPermission
);

module.exports = router;
