const { use } = require('../router-mock');

describe('routes/eligibility/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../src/routes/householder-planning/index');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use.mock.calls.length).toBe(2);
  });
});
