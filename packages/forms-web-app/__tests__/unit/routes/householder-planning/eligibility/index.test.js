const { use } = require('../../router-mock');

const listedBuildingHouseholderRouter = require('../../../../../src/routes/householder-planning/eligibility/listed-building-householder');
const enforcementNoticeHouseholderRouter = require('../../../../../src/routes/householder-planning/eligibility/enforcement-notice-householder');
const grantedOrRefusedRouter = require('../../../../../src/routes/householder-planning/eligibility/granted-or-refused');

describe('routes/householder-planning/eligibility/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/index');
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(listedBuildingHouseholderRouter);
    expect(use).toHaveBeenCalledWith(enforcementNoticeHouseholderRouter);
    expect(use).toHaveBeenCalledWith(grantedOrRefusedRouter);

    expect(use.mock.calls.length).toBe(3);
  });
});
