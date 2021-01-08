const { use } = require('./router-mock');
const appellantSubmissionRouter = require('../../../src/routes/appellant-submission');
const applicationNumberRouter = require('../../../src/routes/application-number');
const checkAnswersRouter = require('../../../src/routes/check-answers');
const eligibilityRouter = require('../../../src/routes/eligibility');
const homeRouter = require('../../../src/routes/home');

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
    expect(use).toHaveBeenCalledWith('/appellant-submission', appellantSubmissionRouter);
    expect(use).toHaveBeenCalledWith('/application-number', applicationNumberRouter);
    expect(use).toHaveBeenCalledWith('/check-answers', checkAnswersRouter);
    expect(use).toHaveBeenCalledWith('/eligibility', eligibilityRouter);
    expect(use.mock.calls.length).toBe(5);
  });
});
