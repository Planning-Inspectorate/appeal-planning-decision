const { use } = require('../router-mock');
const anyOfFollowingRouter = require('../../../../src/routes/before-you-start/any-of-following');
const localPlanningDepartmentRouter = require('../../../../src/routes/before-you-start/any-of-following');

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
    expect(use).toHaveBeenCalledWith(localPlanningDepartmentRouter);
    expect(use).toHaveBeenCalledWith('/any-of-following', anyOfFollowingRouter);

    expect(use.mock.calls.length).toBe(2);
  });
});
