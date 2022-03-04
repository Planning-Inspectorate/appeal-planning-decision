const { use } = require('../router-mock');
const eligibilityRouter = require('../../../../src/routes/eligibility/index');

describe('routes/householder-planning/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../src/routes/householder-planning/index');
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(eligibilityRouter);
  });
});
