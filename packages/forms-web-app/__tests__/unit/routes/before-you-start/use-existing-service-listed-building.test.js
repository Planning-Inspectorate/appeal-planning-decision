const { get } = require('../router-mock');
const useExistingServiceListedBuildingController = require('../../../../src/controllers/before-you-start/use-existing-service-listed-building');

describe('routes/use-existing-service-listed-building', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/before-you-start/use-existing-service-listed-building');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/use-existing-service-listed-building',
      useExistingServiceListedBuildingController.getUseExistingServiceListedBuilding
    );
  });
});
