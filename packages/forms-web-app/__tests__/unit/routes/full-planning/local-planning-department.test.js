const { get, post } = require('../router-mock');
const localPlanningDepartmentController = require('../../../../src/controllers/full-planning/local-planning-department');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
  rules: localPlanningDepartmentValidationRules,
} = require('../../../../src/validators/full-planning/local-planning-department');

jest.mock('../../../../src/validators/full-planning/local-planning-department');

describe('routes/full-planning/local-planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-planning/local-planning-department');
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
