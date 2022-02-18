const express = require('express');
const {
  getExpectInquiryLast,
  postExpectInquiryLast,
} = require('../../../controllers/full-appeal/submit-appeal/expect-inquiry-last');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: numberfieldValidationRules } = require('../../../validators/common/numberfield');

const router = express.Router();

router.get(
  '/submit-appeal/expect-inquiry-last',
  [fetchExistingAppealMiddleware],
  getExpectInquiryLast
);
router.post(
  '/submit-appeal/expect-inquiry-last',
  numberfieldValidationRules({
    fieldName: 'expected-days',
    emptyError: 'Enter how many days you would expect the inquiry to last',
    invalidError:
      'The days you would expect the inquiry to last must be a whole number between 1 and 999',
  }),
  validationErrorHandler,
  postExpectInquiryLast
);

module.exports = router;
