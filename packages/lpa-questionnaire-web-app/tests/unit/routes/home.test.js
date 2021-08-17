const { get } = require('./router-mock');
const indexController = require('../../../src/controllers');
const authenticateMiddleware = require('../../../src/middleware/authenticate');

describe('routes/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/home');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/:id((?!(upload|delete)\\w+))',
      authenticateMiddleware,
      indexController.getIndex
    );
  });
});
