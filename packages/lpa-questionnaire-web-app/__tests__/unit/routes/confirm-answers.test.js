const { get } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const confirmAnswersController = require('../../../src/controllers/confirm-answers');
const fetchAppealMiddleware = require('../../../src/middleware/common/fetch-appeal');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/common/fetch-existing-appeal-reply');
const alreadySubmittedMiddleware = require('../../../src/middleware/already-submitted');

describe('routes/confirm-answers', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/confirm-answers');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/appeal-questionnaire/:id/${VIEW.CONFIRM_ANSWERS}`,
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
      confirmAnswersController
    );
  });
});
