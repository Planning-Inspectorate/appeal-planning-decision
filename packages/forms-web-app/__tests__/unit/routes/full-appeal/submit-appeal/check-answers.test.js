const { get } = require('../../router-mock');
const checkAnswersController = require('../../../../../src/controllers/full-appeal/submit-appeal/check-answers');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

describe('routes/full-appeal/check-answers', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/check-answers');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/check-answers',
      [fetchExistingAppealMiddleware],
      checkAnswersController.getCheckAnswers
    );
  });
});
