const { use } = require('./router-mock');
const appellantSubmissionRouter = require('../../../src/routes/appellant-submission');
const eligibilityRouter = require('../../../src/routes/eligibility');
const homeRouter = require('../../../src/routes/home');
const cookieRouter = require('../../../src/routes/cookies');
const guidancePagesRouter = require('../../../src/routes/guidance-pages');
const yourPlanningAppealRouter = require('../../../src/routes/your-planning-appeal');
const fullPlanningAppellantSubmissionRouter = require('../../../src/routes/full-planning/full-appeal');
const fullPlanningRouter = require('../../../src/routes/full-planning/index');

const checkDecisionDateDeadline = require('../../../src/middleware/check-decision-date-deadline');

describe('routes/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith('/', homeRouter);
    expect(use).toHaveBeenCalledWith('/', guidancePagesRouter);
    expect(use).toHaveBeenCalledWith('/cookies', cookieRouter);
    expect(use).toHaveBeenCalledWith(
      '/appellant-submission',
      checkDecisionDateDeadline,
      appellantSubmissionRouter
    );
    expect(use).toHaveBeenCalledWith(
      '/full-appeal',
      checkDecisionDateDeadline,
      fullPlanningAppellantSubmissionRouter
    );
    expect(use).toHaveBeenCalledWith('/eligibility', checkDecisionDateDeadline, eligibilityRouter);
    expect(use).toHaveBeenCalledWith('/your-planning-appeal', yourPlanningAppealRouter);
    expect(use).toHaveBeenCalledWith('/before-you-start', fullPlanningRouter);

    expect(use.mock.calls.length).toBe(10);
  });
});
