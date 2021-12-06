const { use } = require('../router-mock');
const localPlanningDepartmentRouter = require('../../../../src/routes/before-you-start/local-planning-department');
const typeOfPlanningApplication = require('../../../../src/routes/before-you-start/type-of-planning-application');
const enforcementNoticeRouter = require('../../../../src/routes/before-you-start/enforcement-notice');

describe('routes/before-you-start/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../src/routes/before-you-start');
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(localPlanningDepartmentRouter);
    expect(use).toHaveBeenCalledWith(typeOfPlanningApplication);
    expect(use).toHaveBeenCalledWith(enforcementNoticeRouter);
    expect(use.mock.calls.length).toBe(3);
  });
});
