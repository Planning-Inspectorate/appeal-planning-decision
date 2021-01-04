const { get, post } = require('../router-mock');
const siteOwnershipCertBController = require('../../../../src/controllers/appellant-submission/site-ownership-certb');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: siteOwnershipCertBValidationRules,
} = require('../../../../src/validators/appellant-submission/site-ownership-certb');

jest.mock('../../../../src/validators/appellant-submission/site-ownership-certb');

describe('routes/appellant-submission/site-ownership-certb', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/site-ownership-certb');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/site-ownership-certb',
      [fetchExistingAppealMiddleware],
      siteOwnershipCertBController.getSiteOwnershipCertB
    );

    expect(post).toHaveBeenCalledWith(
      '/site-ownership-certb',
      siteOwnershipCertBValidationRules(),
      validationErrorHandler,
      siteOwnershipCertBController.postSiteOwnershipCertB
    );
  });
});
