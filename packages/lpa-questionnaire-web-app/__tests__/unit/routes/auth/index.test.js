const { use } = require('../router-mock');
const authenticationRouter = require('../../../../src/routes/auth/authentication');

describe('routes/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/auth/index');
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(authenticationRouter);
  });
});
