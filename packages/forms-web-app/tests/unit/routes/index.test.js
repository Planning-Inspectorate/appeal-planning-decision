const {
  routes: { cookies: cookiesRouter },
} = require('@pins/common');
const { use } = require('./router-mock');

const appellantSubmissionRouter = require('../../../src/routes/appellant-submission');
const eligibilityRouter = require('../../../src/routes/eligibility');
const homeRouter = require('../../../src/routes/home');
const guidancePagesRouter = require('../../../src/routes/guidance-pages');
const yourPlanningAppealRouter = require('../../../src/routes/your-planning-appeal');

const getPreviousPagePathMiddleware = require('../../../src/middleware/get-previous-page-path');

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
    expect(use).toHaveBeenCalledWith('/cookies', [getPreviousPagePathMiddleware], cookiesRouter);
    expect(use).toHaveBeenCalledWith('/appellant-submission', appellantSubmissionRouter);
    expect(use).toHaveBeenCalledWith('/eligibility', eligibilityRouter);
    expect(use).toHaveBeenCalledWith('/your-planning-appeal', yourPlanningAppealRouter);
    expect(use.mock.calls.length).toBe(6);
  });
});
