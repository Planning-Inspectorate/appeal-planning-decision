const { post } = require('./router-mock');

const confirmEmailController = require('../../../src/controllers/confirm-email');

describe('routes/confirm-email', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/confirm-email');
  });

  it('should define the expected routes', () => {
    expect(post).toHaveBeenCalledWith('/', confirmEmailController.confirmEmailCreate);
  });
});
