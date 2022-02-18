const { get, post } = require('../../router-mock');
const {
  getExpectInquiryLast,
  postExpectInquiryLast,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/expect-inquiry-last');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: numberfieldValidationRules,
} = require('../../../../../src/validators/common/numberfield');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/numberfield');

describe('routes/full-appeal/submit-appeal/expect-inquiry-last', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/expect-inquiry-last');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/expect-inquiry-last',
      [fetchExistingAppealMiddleware],
      getExpectInquiryLast
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/expect-inquiry-last',
      numberfieldValidationRules(),
      validationErrorHandler,
      postExpectInquiryLast
    );
    expect(numberfieldValidationRules).toHaveBeenCalledWith({
      fieldName: 'expected-days',
      emptyError: 'Enter how many days you would expect the inquiry to last',
      invalidError:
        'The days you would expect the inquiry to last must be a whole number between 1 and 999',
    });
  });
});
