const { use } = require('../router-mock');

const localPlanningDepartmentRouter = require('../../../../src/routes/full-planning/local-planning-department');
const typeOfPlanningRouter = require('../../../../src/routes/full-planning/type-of-planning-application');
const anyOfFollowingRouter = require('../../../../src/routes/full-planning/any-of-following');
const useADifferentServiceRouter = require('../../../../src/routes/full-planning/use-a-different-service');
const outOfTimeRouter = require('../../../../src/routes/full-planning/out-of-time');

describe('routes/full-planning/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-planning/index');
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(localPlanningDepartmentRouter);
    expect(use).toHaveBeenCalledWith(typeOfPlanningRouter);
    expect(use).toHaveBeenCalledWith(anyOfFollowingRouter);
    expect(use).toHaveBeenCalledWith(useADifferentServiceRouter);
    expect(use).toHaveBeenCalledWith(outOfTimeRouter);

    expect(use.mock.calls.length).toBe(5);
  });
});
