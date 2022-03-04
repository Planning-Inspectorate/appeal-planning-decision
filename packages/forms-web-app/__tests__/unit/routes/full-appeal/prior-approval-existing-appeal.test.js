const { get, post } = require('../router-mock');
const {
  getPriorApprovalExistingHome,
  postPriorApprovalExistingHome,
} = require('../../../../src/controllers/full-appeal/prior-approval-existing-home');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../src/validators/common/options');

jest.mock('../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../src/validators/common/options');

describe('routes/full-appeal/prior-approval-existing-home', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal/prior-approval-existing-home');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/prior-approval-existing-home',
      [fetchExistingAppealMiddleware],
      getPriorApprovalExistingHome
    );
    expect(post).toHaveBeenCalledWith(
      '/prior-approval-existing-home',
      optionsValidationRules(),
      validationErrorHandler,
      postPriorApprovalExistingHome
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'prior-approval-existing-home',
      emptyError: 'Select yes if you applied for prior approval to extend an existing home',
    });
  });
});
