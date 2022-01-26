const { get, post } = require('../../router-mock');
const {
  getAreYouATenant,
  postAreYouATenant,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/are-you-a-tenant');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/are-you-a-tenant', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/are-you-a-tenant');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/are-you-a-tenant',
      [fetchExistingAppealMiddleware],
      getAreYouATenant
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/are-you-a-tenant',
      optionsValidationRules(),
      validationErrorHandler,
      postAreYouATenant
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'are-you-a-tenant',
      emptyError: 'Select yes if you are a tenant of the agricultural holding',
    });
  });
});
