const { use } = require('./router-mock');

const homeRouter = require('../../../src/routes/home');
const filesRouter = require('../../../src/routes/files');
const taskListRouter = require('../../../src/routes/task-list');
const confirmAnswersRouter = require('../../../src/routes/confirm-answers');
const accuracySubmissionRouter = require('../../../src/routes/accuracy-submission');
const otherAppealsRouter = require('../../../src/routes/other-appeals');
const extraConditionsRouter = require('../../../src/routes/extra-conditions');
const { router: interestedPartiesRouter } = require('../../../src/routes/interested-parties');
const { router: representationsRouter } = require('../../../src/routes/representations');
const { router: notifyingPartiesRouter } = require('../../../src/routes/notifying-parties');
const healthSafetyRouter = require('../../../src/routes/health-safety');
const developmentPlanRouter = require('../../../src/routes/development-plan');
const { router: uploadPlansRouter } = require('../../../src/routes/upload-plans');
const informationSubmittedRouter = require('../../../src/routes/information-submitted');
const { router: officersReportRouter } = require('../../../src/routes/officers-report');
const { router: siteNoticesRouter } = require('../../../src/routes/site-notices');
const { router: conservationAreaMapRouter } = require('../../../src/routes/conservation-area-map');
const { router: planningHistoryRouter } = require('../../../src/routes/planning-history');
const { router: otherPoliciesRouter } = require('../../../src/routes/other-policies');
const { router: statutoryDevelopmentRouter } = require('../../../src/routes/statutory-development');
const booleanQuestionRouter = require('../../../src/routes/question-type/boolean');
const supplementaryDocumentsRouter = require('../../../src/routes/supplementary-documents');
const contactUsRouter = require('../../../src/routes/contact-us');

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
    expect(use).toHaveBeenCalledWith(representationsRouter);
    expect(use).toHaveBeenCalledWith(notifyingPartiesRouter);
    expect(use).toHaveBeenCalledWith(healthSafetyRouter);
    expect(use).toHaveBeenCalledWith(developmentPlanRouter);
    expect(use).toHaveBeenCalledWith(uploadPlansRouter);
    expect(use).toHaveBeenCalledWith(informationSubmittedRouter);
    expect(use).toHaveBeenCalledWith(officersReportRouter);
    expect(use).toHaveBeenCalledWith(siteNoticesRouter);
    expect(use).toHaveBeenCalledWith(conservationAreaMapRouter);
    expect(use).toHaveBeenCalledWith(planningHistoryRouter);
    expect(use).toHaveBeenCalledWith(otherPoliciesRouter);
    expect(use).toHaveBeenCalledWith(statutoryDevelopmentRouter);
    expect(use).toHaveBeenCalledWith(booleanQuestionRouter);
    expect(use).toHaveBeenCalledWith(supplementaryDocumentsRouter);
    expect(use).toHaveBeenCalledWith(contactUsRouter);
  });
});
