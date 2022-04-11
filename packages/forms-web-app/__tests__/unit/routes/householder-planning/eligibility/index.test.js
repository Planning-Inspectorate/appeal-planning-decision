const { use } = require('../../router-mock');

const claimingCostsHouseholderRouter = require('../../../../../src/routes/householder-planning/eligibility/claiming-costs-householder');
const enforcementNoticeHouseholderRouter = require('../../../../../src/routes/householder-planning/eligibility/enforcement-notice-householder');
const grantedOrRefusedHouseholderRouter = require('../../../../../src/routes/householder-planning/eligibility/granted-or-refused-householder');
const listedBuildingHouseholderRouter = require('../../../../../src/routes/householder-planning/eligibility/listed-building-householder');
const dateDecisionDueHouseholderRouter = require('../../../../../src/routes/householder-planning/eligibility/date-decision-due-householder');
const decisionDateHouseholderRouter = require('../../../../../src/routes/householder-planning/eligibility/decision-date-householder');
const conditionsHouseholderPermissionRouter = require('../../../../../src/routes/householder-planning/eligibility/conditions-householder-permission');
const useExistingServiceCostsRouter = require('../../../../../src/routes/householder-planning/eligibility/use-existing-service-costs');

describe('routes/householder-planning/eligibility/index', () => {
  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/index');
  });

  it('should define the expected routes', () => {
    expect(use.mock.calls.length).toBe(8);
    expect(use).toHaveBeenCalledWith(claimingCostsHouseholderRouter);
    expect(use).toHaveBeenCalledWith(enforcementNoticeHouseholderRouter);
    expect(use).toHaveBeenCalledWith(grantedOrRefusedHouseholderRouter);
    expect(use).toHaveBeenCalledWith(listedBuildingHouseholderRouter);
    expect(use).toHaveBeenCalledWith(dateDecisionDueHouseholderRouter);
    expect(use).toHaveBeenCalledWith(decisionDateHouseholderRouter);
    expect(use).toHaveBeenCalledWith(conditionsHouseholderPermissionRouter);
    expect(use).toHaveBeenCalledWith(useExistingServiceCostsRouter);
  });
});
