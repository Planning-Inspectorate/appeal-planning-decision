const express = require('express');
const {
  getPriorApprovalExistingHome,
  postPriorApprovalExistingHome,
} = require('../../controllers/full-appeal/prior-approval-existing-home');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../validators/common/options');

const router = express.Router();

router.get(
  '/prior-approval-existing-home',
  [fetchExistingAppealMiddleware],
  getPriorApprovalExistingHome
);
router.post(
  '/prior-approval-existing-home',
  optionsValidationRules({
    fieldName: 'prior-approval-existing-home',
    emptyError: 'Select yes if you applied for prior approval to extend an existing home',
  }),
  validationErrorHandler,
  postPriorApprovalExistingHome
);

module.exports = router;
