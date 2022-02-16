const { get, post } = require('../../router-mock');
const {
  getWhyHearing,
  postWhyHearing,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/why-hearing');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: textfieldValidationRules,
} = require('../../../../../src/validators/common/textfield');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/textfield');

describe('routes/full-appeal/submit-appeal/why-hearing', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/why-hearing');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/why-hearing',
      [fetchExistingAppealMiddleware],
      getWhyHearing
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/why-hearing',
      textfieldValidationRules(),
      validationErrorHandler,
      postWhyHearing
    );
    expect(textfieldValidationRules).toHaveBeenCalledWith({
      fieldName: 'why-hearing',
      emptyError: 'Enter why you would prefer a hearing',
      tooLongError: 'Hearing information must be $maxLength characters or less',
    });
  });
});
