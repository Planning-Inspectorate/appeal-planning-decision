const { get, post } = require('../../router-mock');
const {
  getOwnAllTheLand,
  postOwnAllTheLand,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/own-all-the-land');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: yesNoValidationRules } = require('../../../../../src/validators/common/yes-no');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/yes-no');

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
      yesNoValidationRules(),
      validationErrorHandler,
      postOwnAllTheLand
    );
    expect(yesNoValidationRules).toHaveBeenCalledWith(
      'own-all-the-land',
      'Select yes if you own all the land involved in the appeal'
    );
  });
});
