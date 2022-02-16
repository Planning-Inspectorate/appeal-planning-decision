const express = require('express');
const {
  getWhyHearing,
  postWhyHearing,
} = require('../../../controllers/full-appeal/submit-appeal/why-hearing');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: textfieldValidationRules } = require('../../../validators/common/textfield');

const router = express.Router();

router.get('/submit-appeal/why-hearing', [fetchExistingAppealMiddleware], getWhyHearing);
router.post(
  '/submit-appeal/why-hearing',
  textfieldValidationRules({
    fieldName: 'why-hearing',
    emptyError: 'Enter why you would prefer a hearing',
    tooLongError: 'Hearing information must be $maxLength characters or less',
  }),
  validationErrorHandler,
  postWhyHearing
);

module.exports = router;
