const { get, post } = require('./router-mock');
const healthSafetyController = require('../../../src/controllers/health-safety');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const { rules: healthSafetyValidationRules } = require('../../../src/validators/health-safety');

jest.mock('../../../src/validators/health-safety');

describe('routes/health-safety', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/health-safety');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/appeal-questionnaire/:id/health-safety`,
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
      healthSafetyController.getHealthSafety
    );
    expect(post).toHaveBeenCalledWith(
      '/appeal-questionnaire/:id/health-safety',
      healthSafetyValidationRules(),
      validationErrorHandler,
      healthSafetyController.postHealthSafety
    );
  });
});
