const { get, post } = require('../../router-mock');
const claimingCostsController = require('../../../../../src/controllers/householder-planning/eligibility/claiming-costs-householder');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  rules: claimingCostsValidationRules,
} = require('../../../../../src/validators/householder-planning/eligibility/claiming-costs-householder');

jest.mock(
  '../../../../../src/validators/householder-planning/eligibility/claiming-costs-householder'
);

describe('routes/eligibility/planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/claiming-costs-householder');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/claiming-costs-householder',
      [fetchExistingAppealMiddleware],
      claimingCostsController.getClaimingCostsHouseholder
    );

    expect(post).toHaveBeenCalledWith(
      '/claiming-costs-householder',
      claimingCostsValidationRules(),
      validationErrorHandler,
      claimingCostsController.postClaimingCostsHouseholder
    );
  });
});
