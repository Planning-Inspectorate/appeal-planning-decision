const { get, post } = require('../router-mock');
const listedBuildingController = require('../../../../src/controllers/householder-planning/listed-building');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
  rules: listedBuildingValidationRules,
} = require('../../../../src/validators/householder-planning/listed-building');

jest.mock('../../../../src/validators/householder-planning/listed-building');

describe('routes/eligibility/planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/householder-planning/listed-building');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/listed-building',
      [fetchExistingAppealMiddleware],
      listedBuildingController.getListedBuilding
    );

    expect(post).toHaveBeenCalledWith(
      '/listed-building',
      listedBuildingValidationRules(),
      validationErrorHandler,
      listedBuildingController.postListedBuilding
    );
  });
});
