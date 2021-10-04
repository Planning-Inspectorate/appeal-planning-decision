const { get, post } = require('../router-mock');
const authenticationController = require('../../../../src/controllers/authentication');
const fetchLPA = require('../../../../src/middleware/fetch-lpa');
const { rules: yourEmailValidatorRules } = require('../../../../src/validators/email');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');

jest.mock('../../../../src/validators/email');

describe('routes/authentication', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/auth/authentication');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/:lpaCode/authentication/your-email/:error(session-expired|link-expired)?`,
      fetchLPA,
      authenticationController.showEnterEmailAddress
    );
    expect(post).toHaveBeenCalledWith(
      '/:lpaCode/authentication/your-email',
      yourEmailValidatorRules(),
      validationErrorHandler,
      fetchLPA,
      authenticationController.processEmailAddress
    );
    expect(get).toHaveBeenCalledWith(
      '/:lpaCode/authentication/confirm-email',
      fetchLPA,
      authenticationController.showEmailConfirmation
    );
  });
});
