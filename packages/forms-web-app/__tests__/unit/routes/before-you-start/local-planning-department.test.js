const { get, post } = require('../router-mock');
const localPlanningDepartmentController = require('../../../../src/controllers/before-you-start/local-planning-department');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
  rules: localPlanningDepartmentValidationRules,
} = require('../../../../src/validators/before-you-start/local-planning-department');

jest.mock('../../../../src/validators/before-you-start/local-planning-department');

describe('routes/before-you-start/local-planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/before-you-start/local-planning-department');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/local-planning-depart',
      [fetchExistingAppealMiddleware],
      localPlanningDepartmentController.getPlanningDepartment
    );

    expect(post).toHaveBeenCalledWith(
      '/local-planning-depart',
      localPlanningDepartmentValidationRules(),
      validationErrorHandler,
      localPlanningDepartmentController.postPlanningDepartment
    );
  });
});
