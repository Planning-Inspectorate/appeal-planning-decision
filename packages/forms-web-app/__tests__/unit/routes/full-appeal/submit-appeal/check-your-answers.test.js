const { get } = require('../../router-mock');
const {
  getCheckYourAnswers,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/check-your-answers');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

describe('routes/full-appeal/check-answers', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/check-your-answers');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/check-your-answers',
      [fetchExistingAppealMiddleware],
      getCheckYourAnswers
    );
  });
});
