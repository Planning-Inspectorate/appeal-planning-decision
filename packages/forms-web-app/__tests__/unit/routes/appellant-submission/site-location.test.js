const { get, post } = require('../router-mock');
const siteLocationController = require('../../../../src/controllers/appellant-submission/site-location');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: siteLocationValidationRules,
} = require('../../../../src/validators/appellant-submission/site-location');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../src/validators/appellant-submission/site-location');

describe('routes/appellant-submission/site-location', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/site-location');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/site-location',
      [fetchExistingAppealMiddleware],
      siteLocationController.getSiteLocation
    );
    expect(post).toHaveBeenCalledWith(
      '/site-location',
      siteLocationValidationRules(),
      validationErrorHandler,
      siteLocationController.postSiteLocation
    );
  });
});
