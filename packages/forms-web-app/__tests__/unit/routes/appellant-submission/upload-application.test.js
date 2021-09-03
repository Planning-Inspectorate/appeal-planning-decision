const { get, post } = require('../router-mock');
const uploadApplicationController = require('../../../../src/controllers/appellant-submission/upload-application');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: uploadApplicationValidationRules,
} = require('../../../../src/validators/appellant-submission/upload-application');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../src/validators/appellant-submission/upload-application');

describe('routes/appellant-submission/upload-application', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/upload-application');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/upload-application',
      [fetchExistingAppealMiddleware],
      uploadApplicationController.getUploadApplication
    );
    expect(post).toHaveBeenCalledWith(
      '/upload-application',
      uploadApplicationValidationRules(),
      validationErrorHandler,
      uploadApplicationController.postUploadApplication
    );
  });
});
