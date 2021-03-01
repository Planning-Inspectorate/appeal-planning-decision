const { get } = require('../router-mock');
const cookiePreferencesController = require('../../../../src/controllers/cookies/cookie-preferences');

describe('routes/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/cookies');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/', cookiePreferencesController.getCookiePreferences);
  });
});
