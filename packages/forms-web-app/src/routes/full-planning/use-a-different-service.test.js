const { get } = require('../../../__tests__/unit/routes/router-mock');
const useADifferentServiceController = require('../../controllers/full-planning/use-a-different-service');

describe('routes/full-planning/use-a-different-service', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('./use-a-different-service');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/use-a-different-service',
      useADifferentServiceController.getUseADifferentService
    );
  });
});
