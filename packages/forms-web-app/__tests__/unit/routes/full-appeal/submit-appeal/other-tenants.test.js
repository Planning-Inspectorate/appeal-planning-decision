const { get, post } = require('../../router-mock');
const {
  getOtherTenants,
  postOtherTenants,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/other-tenants');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/other-tenants', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/other-tenants');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/other-tenants',
      [fetchExistingAppealMiddleware],
      getOtherTenants
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/other-tenants',
      optionsValidationRules(),
      validationErrorHandler,
      postOtherTenants
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'other-tenants',
      emptyError: 'Select yes if there are any other tenants',
    });
  });
});
