const { get } = require('./router-mock');
const magicLinkController = require('../../../src/controllers/magiclink');
const getDataFromMagicLinkJWT = require('../../../src/middleware/get-magiclink-jwt-data');

describe('routes/magiclink', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/magiclink');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/magiclink/:magiclink`,
      getDataFromMagicLinkJWT,
      magicLinkController.login
    );
  });
});
