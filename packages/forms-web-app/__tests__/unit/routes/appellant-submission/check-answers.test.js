const { get } = require('../router-mock');
const checkAnswersController = require('../../../../src/controllers/appellant-submission/check-answers');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

describe('routes/check-answers', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/check-answers');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/check-answers',
      [fetchExistingAppealMiddleware],
      checkAnswersController.getCheckAnswers
    );
  });
});
