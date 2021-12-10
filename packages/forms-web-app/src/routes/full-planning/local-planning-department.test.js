const { get, post } = require('../../../__tests__/unit/routes/router-mock');
const localPlanningDepartmentController = require('../../controllers/full-planning/local-planning-department');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const {
  rules: localPlanningDepartmentValidationRules,
} = require('../../validators/full-planning/local-planning-department');

jest.mock('../../validators/full-planning/local-planning-department');

describe('routes/full-planning/local-planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('./local-planning-department');
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
