const { get } = require('./router-mock');

const beforeYouStartController = require('../../../src/controllers/before-you-start');

describe('routes/before-you-start', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/before-you-start');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/', beforeYouStartController.getBeforeYouStartFirstPage);
  });
});
