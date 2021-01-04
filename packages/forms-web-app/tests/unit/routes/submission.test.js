const { get, post } = require('./router-mock');
const submissionController = require('../../../src/controllers/submission');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const { rules: submissionValidationRules } = require('../../../src/validators/submission');

jest.mock('../../../src/validators/submission');

describe('routes/submission', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/submission');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/', submissionController.getSubmission);
    expect(post).toHaveBeenCalledWith(
      '/',
      submissionValidationRules(),
      validationErrorHandler,
      submissionController.postSubmission
    );
  });
});
