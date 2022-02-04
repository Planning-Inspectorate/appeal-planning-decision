const { get, post } = require('../../router-mock');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const declarationController = require('../../../../../src/controllers/full-appeal/submit-appeal/declaration');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');

describe('routes/full-appeal/submit-appeal/declaration', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/declaration');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/declaration',
      [fetchExistingAppealMiddleware],
      declarationController.getDeclaration
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/declaration',
      validationErrorHandler,
      declarationController.postDeclaration
    );
  });
});
