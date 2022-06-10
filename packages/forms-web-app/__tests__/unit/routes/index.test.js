const { use } = require('./router-mock');
const appellantSubmissionRouter = require('../../../src/routes/appellant-submission');
const eligibilityRouter = require('../../../src/routes/eligibility');
const homeRouter = require('../../../src/routes/home');
const cookieRouter = require('../../../src/routes/cookies');
const guidancePagesRouter = require('../../../src/routes/guidance-pages');
const yourPlanningAppealRouter = require('../../../src/routes/your-planning-appeal');
const fullAppealAppellantSubmissionRouter = require('../../../src/routes/full-appeal/submit-appeal');
const fullAppealRouter = require('../../../src/routes/full-appeal/index');
const householderPlanningRouter = require('../../../src/routes/householder-planning/index');
const documentRouter = require('../../../src/routes/document');
const beforeYouStartRouter = require('../../../src/routes/before-you-start/before-you-start');
const submitAppealRouter = require('../../../src/routes/submit-appeal');
const checkDecisionDateDeadline = require('../../../src/middleware/check-decision-date-deadline');
const checkAppealTypeExists = require('../../../src/middleware/check-appeal-type-exists');

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
      checkAppealTypeExists,
      checkDecisionDateDeadline,
      appellantSubmissionRouter
    );
    expect(use).toHaveBeenCalledWith(
      '/full-appeal',
      checkAppealTypeExists,
      checkDecisionDateDeadline,
      fullAppealAppellantSubmissionRouter
    );
    expect(use).toHaveBeenCalledWith('/eligibility', checkDecisionDateDeadline, eligibilityRouter);
    expect(use).toHaveBeenCalledWith('/your-planning-appeal', yourPlanningAppealRouter);
    expect(use).toHaveBeenCalledWith(
      '/before-you-start',
      checkAppealTypeExists,
      checkDecisionDateDeadline,
      fullAppealRouter
    );
    expect(use).toHaveBeenCalledWith(
      '/before-you-start',
      checkAppealTypeExists,
      checkDecisionDateDeadline,
      householderPlanningRouter
    );
    expect(use).toHaveBeenCalledWith('/document', documentRouter);

    expect(use).toHaveBeenCalledWith('/before-you-start', beforeYouStartRouter);
    expect(use).toHaveBeenCalledWith(
      '/submit-appeal',
      checkAppealTypeExists,
      checkDecisionDateDeadline,
      submitAppealRouter
    );
  });
});
