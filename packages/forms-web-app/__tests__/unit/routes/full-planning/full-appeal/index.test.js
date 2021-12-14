const { use } = require('../../router-mock');

describe('routes/full-planning/full-appeal/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-planning/full-appeal');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use.mock.calls.length).toBe(1);
  });
});
