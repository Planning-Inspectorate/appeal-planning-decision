const { get, post } = require('../../router-mock');
const enforcementNoticeController = require('../../../../../src/controllers/householder-planning/eligibility/enforcement-notice-householder');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: enforcementNoticeValidationRules,
} = require('../../../../../src/validators/householder-planning/eligibility/enforcement-notice-householder');

jest.mock(
  '../../../../../src/validators/householder-planning/eligibility/enforcement-notice-householder'
);

describe('routes/householder-planning/eligibility/enforcement-notice', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/householder-planning/eligibility/enforcement-notice-householder');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/enforcement-notice-householder',
      [fetchExistingAppealMiddleware],
      enforcementNoticeController.getEnforcementNoticeHouseholder
    );
    expect(post).toHaveBeenCalledWith(
      '/enforcement-notice-householder',
      enforcementNoticeValidationRules(),
      validationErrorHandler,
      enforcementNoticeController.postEnforcementNoticeHouseholder
    );
  });
});
