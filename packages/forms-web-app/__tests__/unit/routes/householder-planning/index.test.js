const { use } = require('../router-mock');

const eligibilityRouter = require('../../../../src/routes/householder-planning/index');

describe('routes/householder-planning/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../src/routes/householder-planning/index');
  });

  it('should define the expected routes', () => {
    expect(use.mock.calls.length).toBe(6);
  });
});
