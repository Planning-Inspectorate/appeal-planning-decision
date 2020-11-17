const { get, post } = require('../router-mock');
const groundsAppealController = require('../../../../src/controllers/appellant-submission/appeal-statement');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: groundsAppealValidationRules,
} = require('../../../../src/validators/appellant-submission/appeal-statement');

jest.mock('../../../../src/validators/appellant-submission/appeal-statement');

describe('routes/appellant-submission/appeal-statement', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/appeal-statement');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/appeal-statement',
      groundsAppealController.getGroundsOfAppeal
    );
    expect(get.mock.calls.length).toBe(1);
    expect(post).toHaveBeenCalledWith(
      '/appeal-statement',
      groundsAppealValidationRules(),
      validationErrorHandler,
      groundsAppealController.postSaveAppeal
    );
    expect(post.mock.calls.length).toBe(1);
  });
});
