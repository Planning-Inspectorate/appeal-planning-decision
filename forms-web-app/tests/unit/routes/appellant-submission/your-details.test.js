const { get, post } = require('../router-mock');
const yourDetailsController = require('../../../../src/controllers/appellant-submission/your-details');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: yourDetailsRules,
} = require('../../../../src/validators/appellant-submission/your-details');

jest.mock('../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../src/validators/appellant-submission/your-details');

describe('routes/appellant-submission/your-details', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/your-details');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/your-details',
      [fetchExistingAppealMiddleware],
      yourDetailsController.getYourDetails
    );
    expect(post).toHaveBeenCalledWith(
      '/your-details',
      [yourDetailsRules(), validationErrorHandler],
      yourDetailsController.postYourDetails
    );
  });
});
