const { get, post } = require('../../router-mock');
const {
  getApplicationForm,
  postApplicationForm,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/application-form');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: fileUploadValidationRules,
} = require('../../../../../src/validators/common/file-upload');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/file-upload');

describe('routes/full-appeal/submit-appeal/application-form', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/application-form');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/application-form',
      [fetchExistingAppealMiddleware],
      getApplicationForm
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/application-form',
      fileUploadValidationRules(),
      validationErrorHandler,
      postApplicationForm
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith('Select your planning application form');
  });
});
