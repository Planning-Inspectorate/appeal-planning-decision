const { get, post } = require('../../router-mock');
const {
  getConditionsHouseholderPermission,
  postConditionsHouseholderPermission,
} = require('../../../../../src/controllers/householder-planning/eligibility/conditions-householder-permission');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/householder-planning/eligibility/conditions-householder-permission', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/conditions-householder-permission');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/conditions-householder-permission',
      [fetchExistingAppealMiddleware],
      getConditionsHouseholderPermission
    );
    expect(post).toHaveBeenCalledWith(
      '/conditions-householder-permission',
      optionsValidationRules(),
      validationErrorHandler,
      postConditionsHouseholderPermission
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'conditions-householder-permission',
      emptyError: 'Select yes if the conditions are for householder planning permission',
    });
  });
});
