const { get, post } = require('./router-mock');
const cookiesController = require('../../src/controllers/cookies');
const validationErrorHandler = require('../../src/validators/validation-error-handler');
const { rules: cookieValidationRules } = require('../../src/validators/cookies');

jest.mock('../../src/validators/cookies');

describe('routes/cookie', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../src/routes/cookies');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/', cookiesController.getCookies);
    expect(post).toHaveBeenCalledWith(
      '/',
      cookieValidationRules(),
      validationErrorHandler,
      cookiesController.postCookies
    );
  });
});
