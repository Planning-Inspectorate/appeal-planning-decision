
const { get, post } = require('../../router-mock');
const { getPlanningObligationDeadline, postPlanningObligationDeadline } = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-deadline');

const setSectionAndTaskNames = require('../../../../../src/middleware/set-section-and-task-names');
const { validationErrorHandler } = require('../../../../../src/validators/validation-error-handler');

jest.mock('../../../../../src/validators/full-appeal/applicant-name');
jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/middleware/set-section-and-task-names');

describe('routes/full-appeal/submit-appeal/planning-obligation-deadline', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/planning-obligation-deadline');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/planning-obligation-deadline',
      getPlanningObligationDeadline
    );

    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/planning-obligation-deadline',
      setSectionAndTaskNames(),
      validationErrorHandler,
      postPlanningObligationDeadline
    );

    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'appealDocumentsSection',
      'planningObligationDeadline'
    );
  });
});
