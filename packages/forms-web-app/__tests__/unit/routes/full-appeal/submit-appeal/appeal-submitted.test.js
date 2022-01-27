const { get } = require('../../router-mock');
const appealSubmittedController = require('../../../../../src/controllers/full-appeal/submit-appeal/appeal-submitted');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');

describe('routes/full-appeal/submit-appeal/appeal-submitted', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/appeal-submitted');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/appeal-submitted',
      [fetchExistingAppealMiddleware],
      appealSubmittedController.getAppealSubmitted
    );
  });
});
