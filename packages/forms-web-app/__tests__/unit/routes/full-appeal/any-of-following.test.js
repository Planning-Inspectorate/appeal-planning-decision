const {
  constants: { APPLICATION_CATEGORIES },
} = require('@pins/business-rules');
const { get, post } = require('../router-mock');
const {
  getAnyOfFollowing,
  postAnyOfFollowing,
} = require('../../../../src/controllers/full-appeal/any-of-following');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const { buildCheckboxValidation } = require('../../../../src/validators/common/checkboxes');

jest.mock('../../../../src/validators/common/checkboxes');

describe('routes/full-appeal/any-of-following', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal/any-of-following');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/any-of-following', getAnyOfFollowing);
    expect(post).toHaveBeenCalledWith(
      '/any-of-following',
      buildCheckboxValidation(),
      validationErrorHandler,
      postAnyOfFollowing
    );
    expect(buildCheckboxValidation).toHaveBeenCalledWith(
      'any-of-following',
      Object.values(APPLICATION_CATEGORIES),
      {
        notEmptyMessage: 'Select if your appeal is about any of the following',
      }
    );
  });
});
