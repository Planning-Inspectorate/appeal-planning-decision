const { get } = require('./router-mock');
const documentServiceProxyController = require('../../../src/controllers/document-service-proxy');
const ensureAppealMatchesSessionMiddleware = require('../../../src/middleware/ensure-appeal-matches-session');

describe('routes/document-service-proxy', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/document-service-proxy');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/:appealId/:documentId',
      [ensureAppealMatchesSessionMiddleware],
      documentServiceProxyController.getDocument
    );
  });
});
