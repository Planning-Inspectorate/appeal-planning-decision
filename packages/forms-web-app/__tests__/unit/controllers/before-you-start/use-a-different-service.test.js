const useADifferentServiceController = require('../../../../src/controllers/before-you-start/use-a-different-service');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/before-you-start/use-a-different-service', () => {
  const req = mockReq();
  const res = mockRes();

  it('Test the getPlanningDepartment method calls the correct template', async () => {
    await useADifferentServiceController.getUseADifferentService(req, res);

    expect(res.render).toBeCalledWith(VIEW.BEFORE_YOU_START.USE_A_DIFFERENT_SERVICE, {
      acpLink: 'https://acp.planninginspectorate.gov.uk/',
    });
  });
});
