const { get, post } = require('../router-mock');
const claimingCostsHouseholderController = require('../../../../src/controllers/householder-planning/claiming-costs-householder');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
  rules: claimingCostsValidationRules,
} = require('../../../../src/validators/householder-planning/claiming-costs-householder');

jest.mock('../../../../src/validators/householder-planning/claiming-costs-householder');

describe('routes/eligibility/planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/householder-planning/claiming-costs-householder');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/claiming-costs-householder',
      [fetchExistingAppealMiddleware],
      claimingCostsHouseholderController.getClaimingCostsHouseholder
    );

    expect(post).toHaveBeenCalledWith(
      '/claiming-costs-householder',
      claimingCostsValidationRules(),
      validationErrorHandler,
      claimingCostsHouseholderController.postClaimingCostsHouseholder
    );
  });
});
