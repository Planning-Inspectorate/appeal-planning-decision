const {
  documentTypes: {
    draftStatementOfCommonGround: { name: taskName },
  },
} = require('@pins/common');
const { get, post } = require('../../router-mock');
const {
  getDraftStatementCommonGround,
  postDraftStatementCommonGround,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/draft-statement-common-ground');
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

describe('routes/full-appeal/submit-appeal/draft-statement-common-ground', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/draft-statement-common-ground');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/draft-statement-common-ground',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getDraftStatementCommonGround
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/draft-statement-common-ground',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postDraftStatementCommonGround
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith(
      'Select your draft statement of common ground'
    );
    expect(setSectionAndTaskNames).toHaveBeenCalledWith('appealDecisionSection', taskName);
  });
});
