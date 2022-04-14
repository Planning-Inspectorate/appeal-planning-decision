const { get } = require('../router-mock');
const useExistingServiceLocalPlanningDepartment = require('../../../../src/controllers/full-appeal/use-existing-service-local-planning-department');

describe('routes/full-appeal/use-existing-service-local-planning-department', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal/use-existing-service-local-planning-department');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/use-existing-service-local-planning-department',
      useExistingServiceLocalPlanningDepartment.getUseExistingServiceLocalPlanningDepartment
    );
  });
});
