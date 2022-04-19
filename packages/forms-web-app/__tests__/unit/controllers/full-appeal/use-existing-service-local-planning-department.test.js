const useExistingServiceLocalPlanningDepartment = require('../../../../src/controllers/full-appeal/use-existing-service-local-planning-department');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/full-appeal/use-existing-service-local-planning-department', () => {
  const req = mockReq();
  const res = mockRes();

  it('Test getUseExistingServiceLocalPlanningDepartment method calls the correct template', async () => {
    await useExistingServiceLocalPlanningDepartment.getUseExistingServiceLocalPlanningDepartment(
      req,
      res
    );

    expect(res.render).toBeCalledWith(
      VIEW.FULL_APPEAL.USE_EXISTING_SERVICE_LOCAL_PLANNING_DEPARTMENT,
      {
        acpLink: 'https://acp.planninginspectorate.gov.uk/',
      }
    );
  });
});
