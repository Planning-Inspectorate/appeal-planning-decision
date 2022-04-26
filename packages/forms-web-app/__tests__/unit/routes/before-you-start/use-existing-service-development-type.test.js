const { get } = require('../router-mock');
const useExistingServiceDevelopmentTypeController = require('../../../../src/controllers/before-you-start/use-existing-service-development-type');

describe('routes/use-existing-service-development-type', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/before-you-start/use-existing-service-development-type');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/use-existing-service-development-type',
      useExistingServiceDevelopmentTypeController.getExistingServiceDevelopmentType
    );
  });
});