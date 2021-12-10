const { get, post } = require('../../../__tests__/unit/routes/router-mock');
const typeOfPlanningController = require('../../controllers/full-planning/type-of-planning-application');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const {
  rules: typeOfPlanningValidationRules,
} = require('../../validators/full-planning/type-of-planning-application');

jest.mock('../../validators/full-planning/type-of-planning-application');

describe('routes/eligibility/planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('./type-of-planning-application');
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
