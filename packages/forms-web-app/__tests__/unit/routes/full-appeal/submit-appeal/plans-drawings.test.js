const { get, post } = require('../../router-mock');
const {
  getPlansDrawings,
  postPlansDrawings,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/plans-drawings');
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

describe('routes/full-appeal/submit-appeal/plans-drawings', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/plans-drawings');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/plans-drawings',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getPlansDrawings
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/plans-drawings',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postPlansDrawings
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith('Select a plan or drawing');
    expect(setSectionAndTaskNames).toHaveBeenCalledWith('appealDocumentsSection', 'plansDrawings');
  });
});
