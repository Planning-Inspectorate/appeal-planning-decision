const { get, post } = require('../../router-mock');
const {
  getOwnAllTheLand,
  postOwnAllTheLand,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/own-all-the-land');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/own-all-the-land', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/own-all-the-land');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/own-all-the-land',
      [fetchExistingAppealMiddleware],
      getOwnAllTheLand
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/own-all-the-land',
      optionsValidationRules(),
      validationErrorHandler,
      postOwnAllTheLand
    );
    expect(optionsValidationRules).toHaveBeenCalledWith(
      'own-all-the-land',
      'Select yes if you own all the land involved in the appeal'
    );
  });
});
