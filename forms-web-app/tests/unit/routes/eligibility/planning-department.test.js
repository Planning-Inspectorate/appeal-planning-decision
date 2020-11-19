const { get, post } = require('../router-mock');
const planningDepartmentController = require('../../../../src/controllers/eligibility/planning-department');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: planningDepartmentValidationRules,
} = require('../../../../src/validators/eligibility/planning-department');

jest.mock('../../../../src/validators/eligibility/planning-department');

describe('routes/eligibility/planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/eligibility/planning-department');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/planning-department',
      planningDepartmentController.getPlanningDepartment
    );
    expect(get).toHaveBeenCalledWith(
      '/planning-department-out',
      planningDepartmentController.getPlanningDepartmentOut
    );
    expect(post).toHaveBeenCalledWith(
      '/planning-department',
      planningDepartmentValidationRules(),
      validationErrorHandler,
      planningDepartmentController.postPlanningDepartment
    );
  });
});
