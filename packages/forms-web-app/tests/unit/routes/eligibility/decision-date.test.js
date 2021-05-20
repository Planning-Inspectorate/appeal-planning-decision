const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { get, post } = require('../router-mock');
const decisionDateController = require('../../../../src/controllers/eligibility/decision-date');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const combineDateInputsMiddleware = require('../../../../src/middleware/combine-date-inputs');
const {
  rules: decisionDateValidationRules,
} = require('../../../../src/validators/eligibility/decision-date');

jest.mock('../../../../src/validators/eligibility/decision-date');

describe('routes/eligibility/decision-date', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/eligibility/decision-date');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/no-decision', decisionDateController.getNoDecision);
    expect(get).toHaveBeenCalledWith(
      '/decision-date',
      [fetchExistingAppealMiddleware],
      decisionDateController.getDecisionDate
    );
    expect(post).toHaveBeenCalledWith(
      '/decision-date',
      [fetchExistingAppealMiddleware, combineDateInputsMiddleware],
      decisionDateValidationRules(),
      validationErrorHandler,
      decisionDateController.postDecisionDate
    );
    expect(get).toHaveBeenCalledWith(
      '/decision-date-passed',
      [fetchExistingAppealMiddleware],
      decisionDateController.getDecisionDatePassed
    );
    expect(get.mock.calls.length).toBe(3);
    expect(post.mock.calls.length).toBe(1);
  });
});
