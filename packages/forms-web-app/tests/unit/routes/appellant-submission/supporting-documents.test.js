const { get, post } = require('../router-mock');
const supportingDocumentsController = require('../../../../src/controllers/appellant-submission/supporting-documents');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: supportingDocumentsValidationRules,
} = require('../../../../src/validators/appellant-submission/supporting-documents');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

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
      supportingDocumentsValidationRules(),
      validationErrorHandler,
      supportingDocumentsController.postSupportingDocuments
    );
  });
});
