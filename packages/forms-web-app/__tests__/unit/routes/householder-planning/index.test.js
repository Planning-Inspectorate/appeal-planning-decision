const { use } = require('../router-mock');

const claimingCostsHouseHolderRouter = require('../../../../src/routes/householder-planning/claiming-costs-householder');

describe('routes/householder-planning/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../src/routes/householder-planning/index');
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(claimingCostsHouseHolderRouter);

    expect(use.mock.calls.length).toBe(1);
  });
});
