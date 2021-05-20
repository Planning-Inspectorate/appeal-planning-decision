const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { get, post } = require('../router-mock');
const householderPlanningPermissionController = require('../../../../src/controllers/eligibility/householder-planning-permission');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
  rules: householderPlanningPermissionValidationRules,
} = require('../../../../src/validators/eligibility/householder-planning-permission');

jest.mock('../../../../src/validators/eligibility/householder-planning-permission');

describe('routes/eligibility/householder-planning-permission', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/eligibility/householder-planning-permission');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/householder-planning-permission-out',
      householderPlanningPermissionController.getServiceOnlyForHouseholderPlanningPermission
    );
    expect(get).toHaveBeenCalledWith(
      '/householder-planning-permission',
      [fetchExistingAppealMiddleware],
      householderPlanningPermissionController.getHouseholderPlanningPermission
    );
    expect(post).toHaveBeenCalledWith(
      '/householder-planning-permission',
      householderPlanningPermissionValidationRules(),
      validationErrorHandler,
      householderPlanningPermissionController.postHouseholderPlanningPermission
    );
  });
});
