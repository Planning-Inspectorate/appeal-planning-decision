const { use } = require('../router-mock');
const appealStatementRouter = require('../../../../src/routes/appellant-submission/appeal-statement');
const supportingDocumentsRouter = require('../../../../src/routes/appellant-submission/supporting-documents');
const uploadApplicationRouter = require('../../../../src/routes/appellant-submission/upload-application');
const uploadDecisionRouter = require('../../../../src/routes/appellant-submission/upload-decision');

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
    expect(use).toHaveBeenCalledWith(supportingDocumentsRouter);
    expect(use).toHaveBeenCalledWith(uploadApplicationRouter);
    expect(use).toHaveBeenCalledWith(uploadDecisionRouter);
    expect(use.mock.calls.length).toBe(4);
  });
});
