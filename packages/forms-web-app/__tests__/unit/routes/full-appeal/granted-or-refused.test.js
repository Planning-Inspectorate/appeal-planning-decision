const { get, post } = require('../router-mock');
const grantedOrRefusedPermissionController = require('../../../../src/controllers/full-appeal/granted-or-refused');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: householderPlanningPermissionStatusValidationRules,
} = require('../../../../src/validators/full-appeal/granted-or-refused');

jest.mock('../../../../src/validators/full-appeal/granted-or-refused');

describe('routes/full-appeal/granted-or-refused', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal/granted-or-refused');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/granted-or-refused',
      fetchExistingAppealMiddleware,
      grantedOrRefusedPermissionController.getGrantedOrRefused
    );
    expect(post).toHaveBeenCalledWith(
      '/granted-or-refused',
      householderPlanningPermissionStatusValidationRules(),
      validationErrorHandler,
      grantedOrRefusedPermissionController.postGrantedOrRefused
    );
    expect(get.mock.calls.length).toBe(1);
    expect(post.mock.calls.length).toBe(1);
  });
});
