const express = require('express');

const costsController = require('../../controllers/eligibility/costs');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: costsValidationRules } = require('../../validators/eligibility/costs');

const router = express.Router();

router.get('/costs-out', [fetchExistingAppealMiddleware], costsController.getCostsOut);
router.get('/costs', [fetchExistingAppealMiddleware], costsController.getCosts);
router.post(
  '/costs',
  [fetchExistingAppealMiddleware],
  costsValidationRules(),
  validationErrorHandler,
  costsController.postCosts
);

module.exports = router;
