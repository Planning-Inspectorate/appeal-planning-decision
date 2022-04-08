const useExistingServiceCostsController = require('../../../../src/controllers/householder-planning/eligibility/use-existing-service-costs');

const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { USE_EXISTING_SERVICE_COSTS: useExistingServiceCosts },
    },
  },
} = require('../../../../src/lib/householder-planning/views');

const { mockReq, mockRes } = require('../../mocks');

describe('controllers/householder-planning/eligibility/use-existing-service-costs', () => {
  const req = mockReq();
  const res = mockRes();

  it('Test the postClaimingCostsHouseholder method calls the correct template', async () => {
    await useExistingServiceCostsController.getUseExistingServiceCosts(req, res);

    expect(res.render).toBeCalledWith(useExistingServiceCosts, {
      acpLink: 'https://acp.planninginspectorate.gov.uk/',
    });
  });
});
