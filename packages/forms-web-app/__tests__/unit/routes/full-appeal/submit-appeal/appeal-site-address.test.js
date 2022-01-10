const { get, post } = require('../../router-mock');
const appealSiteAddressController = require('../../../../../src/controllers/full-appeal/submit-appeal/appeal-site-address');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: appealSiteAddressValidationRules,
} = require('../../../../../src/validators/full-appeal/appeal-site-address');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../../src/validators/full-appeal/appeal-site-address');

describe('routes/full-appeal/submit-appeal/appeal-site-address', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/appeal-site-address');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/appeal-site-address',
      [fetchExistingAppealMiddleware],
      appealSiteAddressController.getAppealSiteAddress
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/appeal-site-address',
      [appealSiteAddressValidationRules(), validationErrorHandler],
      appealSiteAddressController.postAppealSiteAddress
    );
  });
});
