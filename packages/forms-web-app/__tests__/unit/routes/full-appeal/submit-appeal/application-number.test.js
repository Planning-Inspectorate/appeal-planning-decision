const { get, post } = require('../../router-mock');
const applicationNumberController = require('../../../../../src/controllers/full-appeal/submit-appeal/application-number');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: applicationNumberValidationRules,
} = require('../../../../../src/validators/full-appeal/application-number');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../../src/validators/full-appeal/application-number');

describe('routes/full-appeal/submit-appeal/application-number', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/application-number');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/application-number',
      [fetchExistingAppealMiddleware],
      applicationNumberController.getApplicationNumber
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/application-number',
      applicationNumberValidationRules(),
      validationErrorHandler,
      applicationNumberController.postApplicationNumber
    );
  });
});
