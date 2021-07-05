const { use } = require('./router-mock');
const appellantSubmissionRouter = require('../../../src/routes/appellant-submission');
const eligibilityRouter = require('../../../src/routes/eligibility');
const homeRouter = require('../../../src/routes/home');
const cookieRouter = require('../../../src/routes/cookies');
const documentsServiceProxyRouter = require('../../../src/routes/document-service-proxy');
const guidancePagesRouter = require('../../../src/routes/guidance-pages');
const yourPlanningAppealRouter = require('../../../src/routes/your-planning-appeal');

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
    expect(use).toHaveBeenCalledWith('/appellant-submission', appellantSubmissionRouter);
    expect(use).toHaveBeenCalledWith('/document', documentsServiceProxyRouter);
    expect(use).toHaveBeenCalledWith('/eligibility', eligibilityRouter);
    expect(use).toHaveBeenCalledWith('/your-planning-appeal', yourPlanningAppealRouter);
    expect(use.mock.calls.length).toBe(7);
  });
});
