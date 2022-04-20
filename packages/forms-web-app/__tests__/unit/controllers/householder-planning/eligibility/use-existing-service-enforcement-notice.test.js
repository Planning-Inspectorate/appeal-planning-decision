const useExistingServiceEnforcementNotice = require('../../../../../src/controllers/householder-planning/eligibility/use-existing-service-enforcement-notice');

const { VIEW } = require('../../../../../src/lib/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/householder-planning/eligibility/use-existing-service-enforcement-notice', () => {
  const req = mockReq();
  const res = mockRes();

  it('Test the getUseExistingServiceEnforcementNotice method calls the correct template', async () => {
    await useExistingServiceEnforcementNotice.getUseExistingServiceEnforcementNotice(req, res);

    expect(res.render).toBeCalledWith(
      VIEW.BEFORE_YOU_START.USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE,
      {
        acpLink: 'https://acp.planninginspectorate.gov.uk/',
      }
    );
  });
});
