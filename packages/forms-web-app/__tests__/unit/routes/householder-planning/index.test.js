const { use } = require('../router-mock');

const decisionDateHouseholderRouter = require('../../../../src/routes/householder-planning/decision-date-householder');

describe('routes/householder-planning/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../src/routes/householder-planning/index');
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(decisionDateHouseholderRouter);

    expect(use.mock.calls.length).toBe(1);
  });
});
