const { get, post } = require('../router-mock');
const submissionController = require('../../../../src/controllers/appellant-submission/submission');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: submissionValidationRules,
} = require('../../../../src/validators/appellant-submission/submission');

jest.mock('../../../../src/validators/appellant-submission/submission');

describe('routes/appellant-submission/submission', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/submission');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/submission', submissionController.getSubmission);
    expect(post).toHaveBeenCalledWith(
      '/submission',
      submissionValidationRules(),
      validationErrorHandler,
      submissionController.postSubmission
    );
  });
});
