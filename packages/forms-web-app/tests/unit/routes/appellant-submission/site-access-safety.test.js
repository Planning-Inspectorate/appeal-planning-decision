const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { get, post } = require('../router-mock');
const siteAccessSafetyController = require('../../../../src/controllers/appellant-submission/site-access-safety');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
  rules: siteAccessSafetyValidationRules,
} = require('../../../../src/validators/appellant-submission/site-access-safety');

jest.mock('../../../../src/validators/appellant-submission/site-access-safety');

describe('routes/appellant-submission/site-access-safety', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/site-access-safety');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/site-access-safety',
      [fetchExistingAppealMiddleware],
      siteAccessSafetyController.getSiteAccessSafety
    );

    expect(post).toHaveBeenCalledWith(
      '/site-access-safety',
      siteAccessSafetyValidationRules(),
      validationErrorHandler,
      siteAccessSafetyController.postSiteAccessSafety
    );
  });
});
