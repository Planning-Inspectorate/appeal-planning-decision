const { get, post } = require('../router-mock');
const authenticationController = require('../../../../src/controllers/authentication');

describe('routes/extra-conditions', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/auth/authentication');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/:lpaCode/authentication/your-email/:error(session-expired|link-expired)?`,
      authenticationController.showEnterEmailAddress
    );
    expect(post).toHaveBeenCalledWith(
      '/:lpaCode/authentication/your-email',
      authenticationController.processEmailAddress
    );
    expect(get).toHaveBeenCalledWith(
      '/:lpaCode/authentication/confirm-email',
      authenticationController.showEmailConfirmation
    );
  });
});
