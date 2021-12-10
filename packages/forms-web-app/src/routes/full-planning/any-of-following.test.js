const { get, post } = require('../../../__tests__/unit/routes/router-mock');
const anyOfFollowingController = require('../../controllers/full-planning/any-of-following');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: anyOfFollowingValidationRules,
} = require('../../validators/full-planning/any-of-following');

jest.mock('../../validators/full-planning/any-of-following');

describe('routes/full-planning/any-of-following', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('./any-of-following');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/any-of-following',
      anyOfFollowingController.getAnyOfFollowing
    );

    expect(post).toHaveBeenCalledWith(
      '/any-of-following',
      anyOfFollowingValidationRules(),
      validationErrorHandler,
      anyOfFollowingController.postAnyOfFollowing
    );
  });
});
