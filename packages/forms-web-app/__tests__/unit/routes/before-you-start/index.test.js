const { use } = require('../router-mock');

describe('routes/before-you-start/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../src/routes/before-you-start');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use.mock.calls.length).toBe(3);
  });
});
