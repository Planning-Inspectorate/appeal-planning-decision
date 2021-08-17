const { get, post } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const accuracySubmissionController = require('../../../src/controllers/accuracy-submission');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const {
  rules: accuracySubmissionValidationRules,
} = require('../../../src/validators/accuracy-submission');
const alreadySubmittedMiddleware = require('../../../src/middleware/already-submitted');
const authenticateMiddleware = require('../../../src/middleware/authenticate');

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
      `/appeal-questionnaire/:id/${VIEW.ACCURACY_SUBMISSION}`,
      [
        authenticateMiddleware,
        fetchAppealMiddleware,
        fetchExistingAppealReplyMiddleware,
        alreadySubmittedMiddleware,
      ],
      accuracySubmissionController.getAccuracySubmission
    );

    expect(post).toHaveBeenCalledWith(
      `/appeal-questionnaire/:id/${VIEW.ACCURACY_SUBMISSION}`,
      authenticateMiddleware,
      accuracySubmissionValidationRules(),
      validationErrorHandler,
      accuracySubmissionController.postAccuracySubmission
    );
  });
});
