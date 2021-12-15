const { get } = require('../router-mock');
const checkAnswersController = require('../../../../src/controllers/full-planning/full-appeal/check-answers');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

describe('routes/full-planning/check-answers', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-planning/full-appeal/check-answers');
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
