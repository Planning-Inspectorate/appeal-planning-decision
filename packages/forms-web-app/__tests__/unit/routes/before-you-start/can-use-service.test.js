const { get } = require('../router-mock');

const canUseServiceController = require('../../../../src/controllers/before-you-start/can-use-service');

describe('routes/before-you-start/can-use-service', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/before-you-start/can-use-service');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/can-use-service', canUseServiceController.getCanUseService);
  });
});
