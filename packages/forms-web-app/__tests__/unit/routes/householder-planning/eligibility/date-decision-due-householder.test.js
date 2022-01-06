const { get, post } = require('../../router-mock');
const dateDecisionDueHouseholderController = require('../../../../../src/controllers/householder-planning/eligibility/date-decision-due-householder');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: dateDecisionDueHouseholderValidationRules,
} = require('../../../../../src/validators/householder-planning/eligibility/date-decision-due-householder');

jest.mock(
  '../../../../../src/validators/householder-planning/eligibility/date-decision-due-householder'
);

describe('routes/householder-planning/eligibility/date-decision-due-householder', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/date-decision-due-householder');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/date-decision-due-householder',
      [fetchExistingAppealMiddleware],
      dateDecisionDueHouseholderController.getDateDecisionDueHouseholder
    );

    expect(post).toHaveBeenCalledWith(
      '/date-decision-due-householder',
      dateDecisionDueHouseholderValidationRules(),
      validationErrorHandler,
      dateDecisionDueHouseholderController.postDateDecisionDueHouseholder
    );
  });
});
