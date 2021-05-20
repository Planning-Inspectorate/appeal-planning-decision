const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { get, post } = require('../router-mock');
const siteAccessController = require('../../../../src/controllers/appellant-submission/site-access');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
  rules: siteAccessValidationRules,
} = require('../../../../src/validators/appellant-submission/site-access');

jest.mock('../../../../src/validators/appellant-submission/site-access');

describe('routes/appellant-submission/site-access', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/site-access');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/site-access',
      [fetchExistingAppealMiddleware],
      siteAccessController.getSiteAccess
    );

    expect(post).toHaveBeenCalledWith(
      '/site-access',
      siteAccessValidationRules(),
      validationErrorHandler,
      siteAccessController.postSiteAccess
    );
  });
});
