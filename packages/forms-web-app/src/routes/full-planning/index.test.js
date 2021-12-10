const { use } = require('../../../__tests__/unit/routes/router-mock');

const localPlanningDepartmentRouter = require('./local-planning-department');
const typeOfPlanningRouter = require('./type-of-planning-application');
const anyOfFollowingRouter = require('./any-of-following');
const useADifferentServiceRouter = require('./use-a-different-service');

describe('routes/full-planning/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('./index');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(localPlanningDepartmentRouter);
    expect(use).toHaveBeenCalledWith(typeOfPlanningRouter);
    expect(use).toHaveBeenCalledWith(anyOfFollowingRouter);
    expect(use).toHaveBeenCalledWith(useADifferentServiceRouter);

    expect(use.mock.calls.length).toBe(4);
  });
});
