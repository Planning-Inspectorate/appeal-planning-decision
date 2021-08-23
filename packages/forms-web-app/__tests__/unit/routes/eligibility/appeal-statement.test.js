const { get, post } = require('../router-mock');
const appealStatementController = require('../../../../src/controllers/eligibility/appeal-statement');

describe('routes/eligibility/appeal-statement', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/eligibility/appeal-statement');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/appeal-statement',
      appealStatementController.getAppealStatement
    );
    expect(get.mock.calls.length).toBe(1);
    expect(post).toHaveBeenCalledWith(
      '/appeal-statement',
      appealStatementController.postAppealStatement
    );
    expect(post.mock.calls.length).toBe(1);
  });
});
