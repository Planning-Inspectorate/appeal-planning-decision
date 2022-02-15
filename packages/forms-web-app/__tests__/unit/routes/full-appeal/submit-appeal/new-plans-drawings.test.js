const { get, post } = require('../../router-mock');
const {
  getNewPlansDrawings,
  postNewPlansDrawings,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/new-plans-drawings');
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

describe('routes/full-appeal/submit-appeal/new-plans-drawings', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/new-plans-drawings');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/new-plans-drawings',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getNewPlansDrawings
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/new-plans-drawings',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postNewPlansDrawings
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith('Select a plan or drawing');
    expect(setSectionAndTaskNames).toHaveBeenCalledWith('appealDocumentsSection', 'plansDrawings');
  });
});
