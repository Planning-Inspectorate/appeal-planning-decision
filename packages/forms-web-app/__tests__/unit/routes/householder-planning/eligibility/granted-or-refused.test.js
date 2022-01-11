const { get, post } = require('../../router-mock');
const grantedOrRefusedHouseholderController = require('../../../../../src/controllers/householder-planning/eligibility/granted-or-refused-householder');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: householderPlanningPermissionStatusValidationRules,
} = require('../../../../../src/validators/householder-planning/eligibility/granted-or-refused-householder');

jest.mock(
  '../../../../../src/validators/householder-planning/eligibility/granted-or-refused-householder'
);

describe('routes/full-planning/granted-or-refused', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/granted-or-refused-householder');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/granted-or-refused-householder',
      fetchExistingAppealMiddleware,
      grantedOrRefusedHouseholderController.getGrantedOrRefusedHouseholder
    );
    expect(post).toHaveBeenCalledWith(
      '/granted-or-refused-householder',
      householderPlanningPermissionStatusValidationRules(),
      validationErrorHandler,
      grantedOrRefusedHouseholderController.postGrantedOrRefusedHouseholder
    );
    expect(get.mock.calls.length).toBe(1);
    expect(post.mock.calls.length).toBe(1);
  });
});
