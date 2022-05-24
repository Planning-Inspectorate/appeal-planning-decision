const { get, post } = require('../../router-mock');
const {
  getOtherSupportingDocuments,
  postOtherSupportingDocuments,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/other-supporting-documents');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: fileUploadValidationRules,
} = require('../../../../../src/validators/common/file-upload');
const setSectionAndTaskNames = require('../../../../../src/middleware/set-section-and-task-names');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/file-upload');
jest.mock('../../../../../src/middleware/set-section-and-task-names');

describe('routes/full-appeal/submit-appeal/other-supporting-documents', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/other-supporting-documents');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/other-supporting-documents',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getOtherSupportingDocuments
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/other-supporting-documents',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postOtherSupportingDocuments
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith('Select a supporting document');
    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'appealDocumentsSection',
      'supportingDocuments'
    );
  });
});
