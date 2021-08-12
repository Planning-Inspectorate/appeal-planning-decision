const { use } = require('../router-mock');

const magiclinkRouter = require('../../../../src/routes/auth/magiclink');
const authenticationRouter = require('../../../../src/routes/auth/authentication');

describe('routes/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/auth/index');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(magiclinkRouter);
    expect(use).toHaveBeenCalledWith(authenticationRouter);
  });
});
