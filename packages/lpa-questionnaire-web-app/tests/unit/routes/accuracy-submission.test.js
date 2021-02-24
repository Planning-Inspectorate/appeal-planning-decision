const { get } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const accuracySubmissionController = require('../../../src/controllers/accuracy-submission');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');

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
  });
});
