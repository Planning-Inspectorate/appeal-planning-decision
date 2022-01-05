const { get, post } = require('../../router-mock');
const {
  getApplicationForm,
  postApplicationForm,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/application-form');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: fileUploadValidationRules,
} = require('../../../../../src/validators/common/file-upload');

jest.mock('../../../../../src/validators/common/file-upload');

describe('routes/full-appeal/submit-appeal/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/submit-appeal/application-form', getApplicationForm);
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/application-form',
      fileUploadValidationRules(),
      validationErrorHandler,
      postApplicationForm
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith('Select your planning application form');
  });
});
