const { get, post } = require('../../router-mock');
const {
  getApplicationForm,
  postApplicationForm,
} = require('../../../../../src/controllers/full-planning/full-appeal/application-form');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: fileUploadValidationRules,
} = require('../../../../../src/validators/common/file-upload');

jest.mock('../../../../../src/validators/common/file-upload');

describe('routes/full-planning/full-appeal/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-planning/full-appeal');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/application-form', getApplicationForm);
    expect(post).toHaveBeenCalledWith(
      '/application-form',
      fileUploadValidationRules(),
      validationErrorHandler,
      postApplicationForm
    );
  });
});
