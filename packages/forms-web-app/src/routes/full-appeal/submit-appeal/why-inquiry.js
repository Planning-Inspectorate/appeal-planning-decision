const express = require('express');
const {
  getWhyInquiry,
  postWhyInquiry,
} = require('../../../controllers/full-appeal/submit-appeal/why-inquiry');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: textfieldValidationRules } = require('../../../validators/common/textfield');

const router = express.Router();

router.get('/submit-appeal/why-inquiry', [fetchExistingAppealMiddleware], getWhyInquiry);
router.post(
  '/submit-appeal/why-inquiry',
  textfieldValidationRules({
    fieldName: 'why-inquiry',
    emptyError: 'Enter why you would prefer an inquiry',
    tooLongError: 'Inquiry information must be $maxLength characters or less',
  }),
  validationErrorHandler,
  postWhyInquiry
);

module.exports = router;
