const { get, post } = require('./router-mock');
const magicLinkController = require('../../../src/controllers/magiclink');
const validatePayloadMiddleware = require('../../../src/middleware/validate-magiclink-payload');
const authenticate = require('../../../src/middleware/authenticate');
require('../../../src/routes/magiclink');

describe('routes/magiclink', () => {
  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/magiclink/:magiclink',
      authenticate,
      magicLinkController.login,
    );
    expect(post).toHaveBeenCalledWith(
      '/magiclink',
      validatePayloadMiddleware,
      magicLinkController.initiateMagicLinkFlow,
    );
  });
});
