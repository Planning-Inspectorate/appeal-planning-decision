const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { get, post } = require('../router-mock');
const applicationNumberController = require('../../../../src/controllers/appellant-submission/application-number');
const {
  rules: applicationNumberValidationRules,
} = require('../../../../src/validators/appellant-submission/application-number');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../src/validators/appellant-submission/application-number');

describe('routes/appellant-submission/application-number', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/application-number');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/application-number',
      [fetchExistingAppealMiddleware],
      applicationNumberController.getApplicationNumber
    );
    expect(post).toHaveBeenCalledWith(
      '/application-number',
      applicationNumberValidationRules(),
      validationErrorHandler,
      applicationNumberController.postApplicationNumber
    );
  });
});
