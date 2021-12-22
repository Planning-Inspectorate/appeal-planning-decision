const { get, post } = require('../router-mock');
const enforcementNoticeController = require('../../../../src/controllers/full-planning/enforcement-notice');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: enforcementNoticeValidationRules,
} = require('../../../../src/validators/full-planning/enforcement-notice');

jest.mock('../../../../src/validators/full-planning/enforcement-notice');

describe('routes/full-planning/enforcement-notice', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-planning/enforcement-notice');
  });

  it('should define the expected routes', () => {
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
