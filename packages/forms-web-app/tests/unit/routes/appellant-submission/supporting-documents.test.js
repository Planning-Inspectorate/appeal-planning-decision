const { get, post } = require('../router-mock');
const supportingDocumentsController = require('../../../../src/controllers/appellant-submission/supporting-documents');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: supportingDocumentsValidationRules,
} = require('../../../../src/validators/appellant-submission/supporting-documents');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../../../../src/middleware/req-files-to-req-body-files');

jest.mock('../../../../src/validators/appellant-submission/supporting-documents');
jest.mock('../../../../src/middleware/req-files-to-req-body-files');

describe('routes/appellant-submission/supporting-documents', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/supporting-documents');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/supporting-documents',
      [fetchExistingAppealMiddleware],
      supportingDocumentsController.getSupportingDocuments
    );
    expect(post).toHaveBeenCalledWith(
      '/supporting-documents',
      [
        reqFilesToReqBodyFilesMiddleware('supporting-documents'),
        supportingDocumentsValidationRules(),
      ],
      validationErrorHandler,
      supportingDocumentsController.postSupportingDocuments
    );
  });
});
