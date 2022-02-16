const { get, post } = require('../../router-mock');
const {
  getHealthSafetyIssues,
  postHealthSafetyIssues,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/health-safety-issues');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');
const {
  rules: textfieldValidationRules,
} = require('../../../../../src/validators/common/textfield');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');
jest.mock('../../../../../src/validators/common/textfield');

describe('routes/full-appeal/submit-appeal/health-safety-issues', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/health-safety-issues');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/health-safety-issues',
      [fetchExistingAppealMiddleware],
      getHealthSafetyIssues
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/health-safety-issues',
      optionsValidationRules(),
      textfieldValidationRules(),
      validationErrorHandler,
      postHealthSafetyIssues
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'health-safety-issues',
      emptyError: 'Select yes if there are any health and safety issues on the appeal site',
    });
    expect(textfieldValidationRules).toHaveBeenCalledWith({
      fieldName: 'health-safety-issues-details',
      targetFieldName: 'health-safety-issues',
      targetFieldValue: 'yes',
      emptyError: 'Tell us about the health and safety issues',
      tooLongError: 'Health and safety information must be $maxLength characters or less',
    });
  });
});
