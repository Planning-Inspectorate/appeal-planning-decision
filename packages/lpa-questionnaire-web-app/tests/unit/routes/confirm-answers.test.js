const { get } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const confirmAnswersController = require('../../../src/controllers/confirm-answers');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');

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
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
      confirmAnswersController
    );
  });
});
