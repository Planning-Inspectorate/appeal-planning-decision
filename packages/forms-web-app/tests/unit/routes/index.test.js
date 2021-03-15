const { use } = require('./router-mock');
const appellantSubmissionRouter = require('../../../src/routes/appellant-submission');
const eligibilityRouter = require('../../../src/routes/eligibility');
const homeRouter = require('../../../src/routes/home');
const cookieRouter = require('../../../src/routes/cookies');
const guidancePagesRouter = require('../../../src/routes/guidance-pages');

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
    expect(use).toHaveBeenCalledWith('/appeal-householder-decision', appellantSubmissionRouter);
    expect(use).toHaveBeenCalledWith('/eligibility', eligibilityRouter);
    expect(use.mock.calls.length).toBe(5);
  });
});
