const { get } = require('../router-mock');
const outOfTimeShutterPageController = require('../../../../src/controllers/full-appeal/out-of-time-shutter-page');

describe('routes/full-appeal/local-planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal/out-of-time');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/you-cannot-appeal',
      outOfTimeShutterPageController.getOutOfTimeShutterPage
    );
  });
});
