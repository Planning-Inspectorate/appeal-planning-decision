const { get, post } = require('../router-mock');
const typeOfPlanningController = require('../../../../src/controllers/before-you-start/type-of-planning-application');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
  rules: typeOfPlanningValidationRules,
} = require('../../../../src/validators/before-you-start/type-of-planning-application');

jest.mock('../../../../src/validators/before-you-start/type-of-planning-application');

describe('routes/eligibility/planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/before-you-start/type-of-planning-application');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/type-of-planning-application',
      [fetchExistingAppealMiddleware],
      typeOfPlanningController.getTypeOfPlanningApplication
    );

    expect(post).toHaveBeenCalledWith(
      '/type-of-planning-application',
      typeOfPlanningValidationRules(),
      validationErrorHandler,
      typeOfPlanningController.postTypeOfPlanningApplication
    );
  });
});
