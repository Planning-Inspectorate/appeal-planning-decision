const { get } = require('../router-mock');
const useExistingServiceApplicationType= require('../../../../src/controllers/full-appeal/use-existing-service-application-type');

describe('routes/full-appeal/use-existing-service-application-type', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal/use-existing-service-application-type');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/use-existing-service-application-type',
      useExistingServiceApplicationType.getUseExistingServiceApplicationType
    );
  });
});
