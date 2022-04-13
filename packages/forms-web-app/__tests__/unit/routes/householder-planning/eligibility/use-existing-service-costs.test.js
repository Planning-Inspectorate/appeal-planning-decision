const { get } = require('../../router-mock');

const useExistingServiceCostsController = require('../../../../../src/controllers/householder-planning/eligibility/use-existing-service-costs');

describe('routes/householder-planning/eligibility/use-existing-service-costs', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/use-existing-service-costs');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/use-existing-service-costs',
      useExistingServiceCostsController.getUseExistingServiceCosts
    );
  });
});
