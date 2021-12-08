const { get } = require('../router-mock');
const useADifferentServiceController = require('../../../../src/controllers/before-you-start/use-a-different-service');

jest.mock('../../../../src/validators/before-you-start/local-planning-department');

describe('routes/before-you-start/use-a-different-service', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/before-you-start/use-a-different-service');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/use-a-different-service',
      useADifferentServiceController.getUseADifferentService
    );
  });
});
