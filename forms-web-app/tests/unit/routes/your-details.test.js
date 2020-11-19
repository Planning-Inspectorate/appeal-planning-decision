const { get, post } = require('./router-mock');
const yourDetailsController = require('../../../src/controllers/your-details');
const fetchExistingAppealMiddleware = require('../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const { rules: yourDetailsRules } = require('../../../src/validators/your-details');

jest.mock('../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../src/validators/your-details');

describe('routes/your-details', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/your-details');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/',
      [fetchExistingAppealMiddleware],
      yourDetailsController.getYourDetails
    );
    expect(post).toHaveBeenCalledWith(
      '/',
      [yourDetailsRules(), validationErrorHandler],
      yourDetailsController.postYourDetails
    );
  });
});
