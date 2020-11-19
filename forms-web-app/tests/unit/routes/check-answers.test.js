const { get } = require('./router-mock');
const checkAnswersController = require('../../../src/controllers/check-answers');
const fetchExistingAppealMiddleware = require('../../../src/middleware/fetch-existing-appeal');

describe('routes/check-answers', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/check-answers');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/',
      [fetchExistingAppealMiddleware],
      checkAnswersController.getCheckAnswers
    );
  });
});
