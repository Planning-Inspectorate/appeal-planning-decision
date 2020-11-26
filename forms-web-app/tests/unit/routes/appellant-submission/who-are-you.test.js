const { get, post } = require('../router-mock');
const whoAreYouController = require('../../../../src/controllers/appellant-submission/who-are-you');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: whoAreYouValidationRules,
} = require('../../../../src/validators/appellant-submission/who-are-you');

jest.mock('../../../../src/validators/appellant-submission/who-are-you');

describe('routes/appellant-submission/who-are-you', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/who-are-you');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/who-are-you',
      [fetchExistingAppealMiddleware],
      whoAreYouController.getWhoAreYou
    );
    expect(post).toHaveBeenCalledWith(
      '/who-are-you',
      whoAreYouValidationRules(),
      validationErrorHandler,
      whoAreYouController.postWhoAreYou
    );
  });
});
