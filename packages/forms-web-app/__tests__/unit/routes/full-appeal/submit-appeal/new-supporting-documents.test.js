const { get, post } = require('../../router-mock');
const {
  getNewSupportingDocuments,
  postNewSupportingDocuments,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/new-supporting-documents');
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

describe('routes/full-appeal/submit-appeal/new-supporting-documents', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/new-supporting-documents');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/new-supporting-documents',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getNewSupportingDocuments
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/new-supporting-documents',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postNewSupportingDocuments
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith('Select a supporting document');
    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'appealDocumentsSection',
      'supportingDocuments'
    );
  });
});
