const { get, post } = require('../router-mock');
const decisionDateController = require('../../../../src/controllers/full-appeal/date-decision-due');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const combineDateInputsMiddleware = require('../../../../src/middleware/combine-date-inputs');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: decisionDateValidationRules,
} = require('../../../../src/validators/full-appeal/date-decision-due');

jest.mock('../../../../src/validators/full-appeal/date-decision-due');

describe('routes/eligibility/decision-date', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal/date-decision-due');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/date-decision-due',
      [fetchExistingAppealMiddleware],
      decisionDateController.getDateDecisionDue
    );
    expect(post).toHaveBeenCalledWith(
      '/date-decision-due',
      [fetchExistingAppealMiddleware, combineDateInputsMiddleware],
      decisionDateValidationRules('decision-date', 'the date the decision was due'),
      validationErrorHandler,
      decisionDateController.postDateDecisionDue
    );

    expect(get.mock.calls.length).toBe(1);
    expect(post.mock.calls.length).toBe(1);
  });
});
