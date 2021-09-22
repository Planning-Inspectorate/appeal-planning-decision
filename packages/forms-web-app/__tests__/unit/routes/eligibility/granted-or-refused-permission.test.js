const { get, post } = require('../router-mock');
const grantedOrRefusedPermissionController = require('../../../../src/controllers/eligibility/granted-or-refused-permission');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: householderPlanningPermissionStatusValidationRules,
} = require('../../../../src/validators/eligibility/granted-or-refused-permission');

jest.mock('../../../../src/validators/eligibility/granted-or-refused-permission');

describe('routes/eligibility/granted-or-refused-permission', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/eligibility/granted-or-refused-permission');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/no-decision', grantedOrRefusedPermissionController.getNoDecision);
    expect(get).toHaveBeenCalledWith(
      '/granted-or-refused-permission',
      fetchExistingAppealMiddleware,
      grantedOrRefusedPermissionController.getGrantedOrRefusedPermission
    );
    expect(get).toHaveBeenCalledWith(
      '/granted-or-refused-permission-out',
      grantedOrRefusedPermissionController.getGrantedOrRefusedPermissionOut
    );
    expect(post).toHaveBeenCalledWith(
      '/granted-or-refused-permission',
      householderPlanningPermissionStatusValidationRules(),
      validationErrorHandler,
      grantedOrRefusedPermissionController.postGrantedOrRefusedPermission
    );
    expect(get.mock.calls.length).toBe(3);
    expect(post.mock.calls.length).toBe(1);
  });
});
