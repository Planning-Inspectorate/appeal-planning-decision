const { get } = require('../router-mock');
const siteOwnershipController = require('../../../../src/controllers/appellant-submission/site-ownership');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../src/validators/appellant-submission/site-ownership');

describe('routes/appellant-submission/site-ownership', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/site-ownership');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/site-ownership',
      [fetchExistingAppealMiddleware],
      siteOwnershipController.getSiteOwnership
    );
  });
});
