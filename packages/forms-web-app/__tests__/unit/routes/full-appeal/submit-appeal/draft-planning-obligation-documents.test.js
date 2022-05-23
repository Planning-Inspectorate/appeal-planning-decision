const { get, post } = require('../../router-mock');
const {
  getDraftPlanningObligation,
  postDraftPlanningObligation,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/draft-planning-obligation');
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

describe('routes/full-appeal/submit-appeal/draft-planning-obligation', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/draft-planning-obligation');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/draft-planning-obligation',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getDraftPlanningObligation
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/draft-planning-obligation',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postDraftPlanningObligation
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith('Select your draft planning obligation');
    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'appealDocumentsSection',
      'draftPlanningObligations'
    );
  });
});
