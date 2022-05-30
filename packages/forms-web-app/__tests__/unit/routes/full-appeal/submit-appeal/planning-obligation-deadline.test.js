const { get, post } = require('../../router-mock');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  getPlanningObligationDeadline,
  postPlanningObligationDeadline,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-deadline');

describe('routes/full-appeal/submit-appeal/planning-obligation-deadline', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/planning-obligation-deadline');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/planning-obligation-deadline',
      getPlanningObligationDeadline
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/planning-obligation-deadline',
      validationErrorHandler,
      postPlanningObligationDeadline
    );
  });
});
