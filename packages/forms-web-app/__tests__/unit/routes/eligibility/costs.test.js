const { get, post } = require('../router-mock');
const costsController = require('../../../../src/controllers/eligibility/costs');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const { rules: costsValidationRules } = require('../../../../src/validators/eligibility/costs');

jest.mock('../../../../src/validators/eligibility/costs');

describe('routes/eligibility/costs', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/eligibility/costs');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/costs-out',
      [fetchExistingAppealMiddleware],
      costsController.getCostsOut
    );
    expect(get).toHaveBeenCalledWith(
      '/costs',
      [fetchExistingAppealMiddleware],
      costsController.getCosts
    );
    expect(post).toHaveBeenCalledWith(
      '/costs',
      [fetchExistingAppealMiddleware],
      costsValidationRules(),
      validationErrorHandler,
      costsController.postCosts
    );
  });
});
