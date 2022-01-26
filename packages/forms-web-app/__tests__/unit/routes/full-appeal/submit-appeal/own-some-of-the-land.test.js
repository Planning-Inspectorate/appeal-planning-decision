const { get, post } = require('../../router-mock');
const {
  getOwnSomeOfTheLand,
  postOwnSomeOfTheLand,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/own-some-of-the-land');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/own-some-of-the-land', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/own-some-of-the-land');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/own-some-of-the-land',
      [fetchExistingAppealMiddleware],
      getOwnSomeOfTheLand
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/own-some-of-the-land',
      optionsValidationRules(),
      validationErrorHandler,
      postOwnSomeOfTheLand
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'own-some-of-the-land',
      emptyError: 'Select yes if you own some of the land involved in the appeal',
    });
  });
});
