const { use } = require('../router-mock');
const anyOfFollowingRouter = require('../../../../src/routes/before-you-start/any-of-following');
const localPlanningDepartmentRouter = require('../../../../src/routes/before-you-start/local-planning-department');
const typeOfPlanningRouter = require('../../../../src/routes/before-you-start/type-of-planning-application');
const useADifferentServiceRouter = require('../../../../src/routes/before-you-start/use-a-different-service');

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
    expect(use).toHaveBeenCalledWith(typeOfPlanningRouter);
    expect(use).toHaveBeenCalledWith(useADifferentServiceRouter);
    expect(use).toHaveBeenCalledWith('/any-of-following', anyOfFollowingRouter);

    expect(use.mock.calls.length).toBe(4);
  });
});
