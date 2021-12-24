const { get, post } = require('../router-mock');
const decisionDateHouseholderController = require('../../../../src/controllers/householder-planning/decision-date-householder');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
  rules: decisionDateHouseholderValidationRules,
} = require('../../../../src/validators/householder-planning/decision-date-householder');

jest.mock('../../../../src/validators/householder-planning/decision-date-householder');

describe('routes/householder-planning/decision-date-householder', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/householder-planning/decision-date-householder');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/decision-date-householder',
      [fetchExistingAppealMiddleware],
      decisionDateHouseholderController.getDecisionDateHouseholder
    );

    expect(post).toHaveBeenCalledWith(
      '/decision-date-householder',
      decisionDateHouseholderValidationRules(),
      validationErrorHandler,
      decisionDateHouseholderController.postDecisionDateHouseholder
    );
  });
});
