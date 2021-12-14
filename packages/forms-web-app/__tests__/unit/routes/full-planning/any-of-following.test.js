const { get, post } = require('../router-mock');
const anyOfFollowingController = require('../../../../src/controllers/full-planning/any-of-following');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: anyOfFollowingValidationRules,
} = require('../../../../src/validators/full-planning/any-of-following');

jest.mock('../../../../src/validators/full-planning/any-of-following');

describe('routes/full-planning/any-of-following', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-planning/any-of-following');
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
