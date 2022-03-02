const { get, post } = require('../../router-mock');
const {
  getPlansDrawingsDocuments,
  postPlansDrawingsDocuments,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/plans-drawings-documents');
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

describe('routes/full-appeal/submit-appeal/plans-drawings-documents', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/plans-drawings-documents');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/plans-drawings-documents',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getPlansDrawingsDocuments
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/plans-drawings-documents',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postPlansDrawingsDocuments
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith(
      'Select your plans, drawings and supporting documents'
    );
    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'planningApplicationDocumentsSection',
      'plansDrawingsSupportingDocuments'
    );
  });
});
