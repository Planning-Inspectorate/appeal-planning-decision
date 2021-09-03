const { get, post } = require('./router-mock');
const developmentPlanController = require('../../../src/controllers/development-plan');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const {
  rules: developmentPlanValidationRules,
} = require('../../../src/validators/development-plan');

jest.mock('../../../src/validators/development-plan');

describe('routes/development-plan', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/development-plan');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/appeal-questionnaire/:id/development-plan`,
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
      developmentPlanController.getDevelopmentPlan
    );
    expect(post).toHaveBeenCalledWith(
      '/appeal-questionnaire/:id/development-plan',
      developmentPlanValidationRules(),
      validationErrorHandler,
      developmentPlanController.postDevelopmentPlan
    );
  });
});
