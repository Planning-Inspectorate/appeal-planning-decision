const { get, post } = require('../router-mock');
const authenticationController = require('../../../../src/controllers/authentication');
const fetchLPA = require('../../../../src/middleware/fetch-lpa');

describe('routes/extra-conditions', () => {
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
