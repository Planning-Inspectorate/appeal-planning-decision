const { get } = require('../../router-mock');

const planningObligationDeadlineController = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-deadline');

describe('routes/full-appeal/submit-appeal/planning-obligation-deadline', () => {
  beforeEach(() => {
    require('../../../../../src/routes/full-appeal/submit-appeal/planning-obligation-deadline');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/planning-obligation-deadline',
      planningObligationDeadlineController.getPlanningObligationDeadline
    );
  });
});
