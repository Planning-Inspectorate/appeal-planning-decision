const { use } = require('../router-mock');
const appealStatementRouter = require('../../../../src/routes/appellant-submission/appeal-statement');
const applicantNameRouter = require('../../../../src/routes/appellant-submission/applicant-name');
const applicationNumberRouter = require('../../../../src/routes/appellant-submission/application-number');
const supportingDocumentsRouter = require('../../../../src/routes/appellant-submission/supporting-documents');
const taskListRouter = require('../../../../src/routes/appellant-submission/task-list');
const uploadApplicationRouter = require('../../../../src/routes/appellant-submission/upload-application');
const uploadDecisionRouter = require('../../../../src/routes/appellant-submission/upload-decision');
const whoAreYouRouter = require('../../../../src/routes/appellant-submission/who-are-you');
const yourDetailsRouter = require('../../../../src/routes/appellant-submission/your-details');

describe('routes/appellant-submission/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/index');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(appealStatementRouter);
    expect(use).toHaveBeenCalledWith(applicantNameRouter);
    expect(use).toHaveBeenCalledWith(applicationNumberRouter);
    expect(use).toHaveBeenCalledWith(supportingDocumentsRouter);
    expect(use).toHaveBeenCalledWith(uploadApplicationRouter);
    expect(use).toHaveBeenCalledWith(uploadDecisionRouter);
    expect(use).toHaveBeenCalledWith(taskListRouter);
    expect(use).toHaveBeenCalledWith(whoAreYouRouter);
    expect(use).toHaveBeenCalledWith(yourDetailsRouter);
    expect(use.mock.calls.length).toBe(9);
  });
});
