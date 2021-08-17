const { get } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const confirmAnswersController = require('../../../src/controllers/confirm-answers');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const authenticateMiddleware = require('../../../src/middleware/authenticate');

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
      [authenticateMiddleware, fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
      confirmAnswersController
    );
  });
});
