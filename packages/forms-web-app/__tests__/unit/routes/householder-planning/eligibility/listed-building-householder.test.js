const { get, post } = require('../../router-mock');
const listedBuildingController = require('../../../../../src/controllers/householder-planning/eligibility/listed-building-householder');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  rules: listedBuildingValidationRules,
} = require('../../../../../src/validators/householder-planning/eligibility/listed-building-householder');

jest.mock(
  '../../../../../src/validators/householder-planning/eligibility/listed-building-householder'
);

describe('routes/eligibility/planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/listed-building-householder');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/listed-building-householder',
      [fetchExistingAppealMiddleware],
      listedBuildingController.getListedBuildingHouseholder
    );

    expect(post).toHaveBeenCalledWith(
      '/listed-building-householder',
      listedBuildingValidationRules(),
      validationErrorHandler,
      listedBuildingController.postListedBuildingHouseholder
    );
  });
});
