const { use } = require('../../router-mock');

const enforcementNoticeRouter = require('../../../../../src/routes/householder-planning/eligibility/enforcement-notice-householder');

describe('routes/householder-planning/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/index');
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(enforcementNoticeRouter);

    expect(use.mock.calls.length).toBe(1);
  });
});
