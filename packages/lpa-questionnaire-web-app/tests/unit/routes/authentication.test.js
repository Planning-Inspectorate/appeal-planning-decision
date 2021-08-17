const { get, post } = require('./router-mock');
const authenticationController = require('../../../src/controllers/authentication');

describe('routes/extra-conditions', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/authentication');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/:id/authentication/your-email/:error(session-expired|link-expired)?`,
      authenticationController.showEnterEmailAddress
    );
    expect(post).toHaveBeenCalledWith(
      '/:id/authentication/your-email',
      authenticationController.processEmailAddress
    );
    expect(get).toHaveBeenCalledWith(
      '/:id/authentication/confirm-email',
      authenticationController.showEmailConfirmation
    );
  });
});
