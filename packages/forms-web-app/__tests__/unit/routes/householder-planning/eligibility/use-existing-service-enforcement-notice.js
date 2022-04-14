const { get } = require('../../router-mock');

const useExistingServiceEnforcementNotice = require('../../../../../src/controllers/householder-planning/eligibility/use-existing-service-enforcement-notice');

describe('routes/householder-planning/eligibility/use-existing-service-enforcement-notice', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/use-existing-service-enforcement-notice');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/use-existing-service-enforcement-notice',
      useExistingServiceEnforcementNotice.getUseExistingServiceEnforcementNotice
    );
  });
});
