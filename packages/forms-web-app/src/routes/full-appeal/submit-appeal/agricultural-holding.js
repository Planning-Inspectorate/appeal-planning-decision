const express = require('express');
const {
  getAgriculturalHolding,
  postAgriculturalHolding,
} = require('../../../controllers/full-appeal/submit-appeal/agricultural-holding');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get(
  '/submit-appeal/agricultural-holding',
  [fetchExistingAppealMiddleware],
  getAgriculturalHolding
);
router.post(
  '/submit-appeal/agricultural-holding',
  optionsValidationRules({
    fieldName: 'agricultural-holding',
    emptyError: 'Select yes if the appeal site is part of an agricultural holding',
  }),
  validationErrorHandler,
  postAgriculturalHolding
);

module.exports = router;
