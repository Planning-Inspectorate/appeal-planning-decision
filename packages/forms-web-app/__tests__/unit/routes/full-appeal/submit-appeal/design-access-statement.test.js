const { get, post } = require('../../router-mock');
const {
  getDesignAccessStatement,
  postDesignAccessStatement,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/design-access-statement');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: fileUploadValidationRules,
} = require('../../../../../src/validators/common/file-upload');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/file-upload');

describe('routes/full-appeal/submit-appeal/design-access-statement', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/design-access-statement');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/design-access-statement',
      [fetchExistingAppealMiddleware],
      getDesignAccessStatement
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/design-access-statement',
      fileUploadValidationRules(),
      validationErrorHandler,
      postDesignAccessStatement
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith(
      'Select your design and access statement'
    );
  });
});
