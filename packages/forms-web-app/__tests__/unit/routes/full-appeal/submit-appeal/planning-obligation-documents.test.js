const { get, post } = require('../../router-mock');
const {
  getPlanningObligationDocuments,
  postPlanningObligationDocuments,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-documents');
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

describe('routes/full-appeal/submit-appeal/planning-obligation-documents', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/planning-obligation-documents');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/planning-obligation',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getPlanningObligationDocuments
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/planning-obligation',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postPlanningObligationDocuments
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith('Select your planning obligation');
    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'appealDocumentsSection',
      'planningObligations'
    );
  });
});
