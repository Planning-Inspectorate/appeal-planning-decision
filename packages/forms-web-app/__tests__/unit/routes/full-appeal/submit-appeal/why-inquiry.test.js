const { get, post } = require('../../router-mock');
const {
  getWhyInquiry,
  postWhyInquiry,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/why-inquiry');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: textfieldValidationRules,
} = require('../../../../../src/validators/common/textfield');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/textfield');

describe('routes/full-appeal/submit-appeal/why-inquiry', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/why-inquiry');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/why-inquiry',
      [fetchExistingAppealMiddleware],
      getWhyInquiry
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/why-inquiry',
      textfieldValidationRules(),
      validationErrorHandler,
      postWhyInquiry
    );
    expect(textfieldValidationRules).toHaveBeenCalledWith({
      fieldName: 'why-inquiry',
      emptyError: 'Enter why you would prefer an inquiry',
      tooLongError: 'Inquiry information must be $maxLength characters or less',
    });
  });
});
