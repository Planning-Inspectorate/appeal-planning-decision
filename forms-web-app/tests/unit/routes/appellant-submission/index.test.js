const { use } = require('../router-mock');
const appealStatementRouter = require('../../../../src/routes/appellant-submission/appeal-statement');
const supportingDocumentsRouter = require('../../../../src/routes/appellant-submission/supporting-documents');

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
    expect(use.mock.calls.length).toBe(2);
  });
});
