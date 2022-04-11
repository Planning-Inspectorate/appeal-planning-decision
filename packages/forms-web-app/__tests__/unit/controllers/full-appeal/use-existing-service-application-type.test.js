const useExistingServiceApplicationType = require('../../../../src/controllers/full-appeal/use-existing-service-application-type');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/full-appeal/use-existing-service-application-type', () => {
  const req = mockReq();
  const res = mockRes();

  it('Test getUseExistingServiceApplicationType method calls the correct template', async () => {
    await useExistingServiceApplicationType.getUseExistingServiceApplicationType(req, res);

    expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.USE_EXISTING_SERVICE_APPLICATION_TYPE, {
      acpLink: 'https://acp.planninginspectorate.gov.uk/',
    });
  });
});
