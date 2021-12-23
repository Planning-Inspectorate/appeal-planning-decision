const { get, post } = require('../router-mock');
const contactDetailsController = require('../../../../src/controllers/full-planning/full-appeal/contact-details');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: contactDetailsRules,
} = require('../../../../src/validators/full-planning/contact-details');

jest.mock('../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../src/validators/full-planning/contact-details');

describe('routes/full-appeal/contact-details', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-planning/full-appeal/contact-details');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/contact-details',
      [fetchExistingAppealMiddleware],
      contactDetailsController.getContactDetails
    );
    expect(post).toHaveBeenCalledWith(
      '/contact-details',
      [contactDetailsRules(), validationErrorHandler],
      contactDetailsController.postContactDetails
    );
  });
});
