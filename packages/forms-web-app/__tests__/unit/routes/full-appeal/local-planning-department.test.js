const { get, post } = require('../router-mock');
const localPlanningDepartmentController = require('../../../../src/controllers/full-appeal/local-planning-department');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
  rules: localPlanningDepartmentValidationRules,
} = require('../../../../src/validators/full-appeal/local-planning-department');

jest.mock('../../../../src/validators/full-appeal/local-planning-department');

describe('routes/full-appeal/local-planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal/local-planning-department');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/local-planning-department',
      [fetchExistingAppealMiddleware],
      localPlanningDepartmentController.getPlanningDepartment
    );

    expect(post).toHaveBeenCalledWith(
      '/local-planning-department',
      localPlanningDepartmentValidationRules(),
      validationErrorHandler,
      localPlanningDepartmentController.postPlanningDepartment
    );
  });
});
