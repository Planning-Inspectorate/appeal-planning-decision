const express = require('express');
const {
  getConditionsHouseholderPermission,
  postConditionsHouseholderPermission,
} = require('../../../controllers/householder-planning/eligibility/conditions-householder-permission');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get(
  '/conditions-householder-permission',
  [fetchExistingAppealMiddleware],
  getConditionsHouseholderPermission
);
router.post(
  '/conditions-householder-permission',
  optionsValidationRules({
    fieldName: 'conditions-householder-permission',
    emptyError: 'Select yes if the conditions are for householder planning permission',
  }),
  validationErrorHandler,
  postConditionsHouseholderPermission
);

module.exports = router;
