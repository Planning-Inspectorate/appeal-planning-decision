const { get, post } = require('../../router-mock');
const {
  getOwnSomeOfTheLand,
  postOwnSomeOfTheLand,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/own-some-of-the-land');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: yesNoValidationRules } = require('../../../../../src/validators/common/yes-no');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/yes-no');

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
      yesNoValidationRules(),
      validationErrorHandler,
      postOwnSomeOfTheLand
    );
    expect(yesNoValidationRules).toHaveBeenCalledWith(
      'own-some-of-the-land',
      'Select yes if you own some of the land involved in the appeal'
    );
  });
});
