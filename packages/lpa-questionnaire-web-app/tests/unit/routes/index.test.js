const { use } = require('./router-mock');

const homeRouter = require('../../../src/routes/home');
const filesRouter = require('../../../src/routes/files');
const taskListRouter = require('../../../src/routes/task-list');
const confirmAnswersRouter = require('../../../src/routes/confirm-answers');
const accuracySubmissionRouter = require('../../../src/routes/accuracy-submission');
const otherAppealsRouter = require('../../../src/routes/other-appeals');
const extraConditionsRouter = require('../../../src/routes/extra-conditions');
const { router: interestedPartiesRouter } = require('../../../src/routes/interested-parties');
const developmentPlanRouter = require('../../../src/routes/development-plan');
const { router: uploadPlansRouter } = require('../../../src/routes/upload-plans');
const informationSubmittedRouter = require('../../../src/routes/information-submitted');
const { router: officersReportRouter } = require('../../../src/routes/officers-report');

describe('routes/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(homeRouter);
    expect(use).toHaveBeenCalledWith(filesRouter);
    expect(use).toHaveBeenCalledWith(taskListRouter);
    expect(use).toHaveBeenCalledWith(confirmAnswersRouter);
    expect(use).toHaveBeenCalledWith(accuracySubmissionRouter);
    expect(use).toHaveBeenCalledWith(otherAppealsRouter);
    expect(use).toHaveBeenCalledWith(extraConditionsRouter);
    expect(use).toHaveBeenCalledWith(interestedPartiesRouter);
    expect(use).toHaveBeenCalledWith(developmentPlanRouter);
    expect(use).toHaveBeenCalledWith(uploadPlansRouter);
    expect(use).toHaveBeenCalledWith(informationSubmittedRouter);
    expect(use).toHaveBeenCalledWith(officersReportRouter);
  });
});
