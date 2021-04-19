const { use } = require('./router-mock');

const { router: officersReportRouter } = require('../../../src/routes/officers-report');

describe('routes/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(officersReportRouter);
  });
});
