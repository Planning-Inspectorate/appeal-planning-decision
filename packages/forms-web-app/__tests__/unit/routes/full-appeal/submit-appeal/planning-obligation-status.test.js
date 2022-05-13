const { get } = require('../../router-mock');

const planningObligationStatusController = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-status');

describe('routes/full-appeal/submit-appeal/planning-obligation-status', () => {
  beforeEach(() => {
    require('../../../../../src/routes/full-appeal/submit-appeal/planning-obligation-status');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/planning-obligation-status',
      planningObligationStatusController.getPlanningObligationStatus
    );
  });
});
