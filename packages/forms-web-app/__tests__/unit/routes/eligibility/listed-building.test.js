const { get, post } = require('../router-mock');
const listedBuildingController = require('../../../../src/controllers/eligibility/listed-building');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: listedBuildingValidationRules,
} = require('../../../../src/validators/eligibility/listed-building');

jest.mock('../../../../src/validators/eligibility/listed-building');

describe('routes/eligibility/listed-building', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/eligibility/listed-building');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/listed-out',
      listedBuildingController.getServiceNotAvailableForListedBuildings
    );
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
