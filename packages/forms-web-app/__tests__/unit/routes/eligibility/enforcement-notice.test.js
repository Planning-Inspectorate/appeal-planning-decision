const { get, post } = require('../router-mock');
const enforcementNoticeController = require('../../../../src/controllers/eligibility/enforcement-notice');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: enforcementNoticeValidationRules,
} = require('../../../../src/validators/eligibility/enforcement-notice');

jest.mock('../../../../src/validators/eligibility/enforcement-notice');

describe('routes/eligibility/enforcement-notice', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/eligibility/enforcement-notice');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/enforcement-notice-out',
      enforcementNoticeController.getServiceNotAvailableWhenReceivedEnforcementNotice
    );
    expect(get).toHaveBeenCalledWith(
      '/enforcement-notice',
      [fetchExistingAppealMiddleware],
      enforcementNoticeController.getEnforcementNotice
    );
    expect(post).toHaveBeenCalledWith(
      '/enforcement-notice',
      enforcementNoticeValidationRules(),
      validationErrorHandler,
      enforcementNoticeController.postEnforcementNotice
    );
  });
});
