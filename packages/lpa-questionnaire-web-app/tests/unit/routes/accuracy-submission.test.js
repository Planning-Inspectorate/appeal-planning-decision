const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { get, post } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const accuracySubmissionController = require('../../../src/controllers/accuracy-submission');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const {
  rules: accuracySubmissionValidationRules,
} = require('../../../src/validators/accuracy-submission');

jest.mock('../../../src/validators/accuracy-submission');

describe('routes/accuracy-submission', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/accuracy-submission');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/:id/${VIEW.ACCURACY_SUBMISSION}`,
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
      accuracySubmissionController.getAccuracySubmission
    );
    expect(post).toHaveBeenCalledWith(
      `/:id/${VIEW.ACCURACY_SUBMISSION}`,
      accuracySubmissionValidationRules(),
      validationErrorHandler,
      accuracySubmissionController.postAccuracySubmission
    );
  });
});
