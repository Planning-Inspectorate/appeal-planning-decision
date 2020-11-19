const { use } = require('../router-mock');
const appealStatementRouter = require('../../../../src/routes/eligibility/appeal-statement');
const decisionDateRouter = require('../../../../src/routes/eligibility/decision-date');
const listedBuildingRouter = require('../../../../src/routes/eligibility/listed-building');
const planningDepartmentRouter = require('../../../../src/routes/eligibility/planning-department');

describe('routes/eligibility/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/eligibility/index');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(appealStatementRouter);
    expect(use).toHaveBeenCalledWith(decisionDateRouter);
    expect(use).toHaveBeenCalledWith(listedBuildingRouter);
    expect(use).toHaveBeenCalledWith(planningDepartmentRouter);
    expect(use.mock.calls.length).toBe(4);
  });
});
