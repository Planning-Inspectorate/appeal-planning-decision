const useADifferentServiceController = require('../../../../src/controllers/full-planning/use-a-different-service');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/full-planning/use-a-different-service', () => {
  const req = mockReq();
  const res = mockRes();

  it('Test the getPlanningDepartment method calls the correct template', async () => {
    await useADifferentServiceController.getUseADifferentService(req, res);

    expect(res.render).toBeCalledWith(VIEW.FULL_PLANNING.USE_A_DIFFERENT_SERVICE, {
      acpLink: 'https://acp.planninginspectorate.gov.uk/',
    });
  });
});
