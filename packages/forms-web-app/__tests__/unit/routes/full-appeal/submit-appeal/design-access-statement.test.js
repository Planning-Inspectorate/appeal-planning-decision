const { documentTypes } = require('@pins/common');
const { get, post } = require('../../router-mock');
const {
  getDesignAccessStatement,
  postDesignAccessStatement,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/design-access-statement');
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

describe('routes/full-appeal/submit-appeal/design-access-statement', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/design-access-statement');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/design-access-statement',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getDesignAccessStatement
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/design-access-statement',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postDesignAccessStatement
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith(
      'Select your design and access statement'
    );
    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'planningApplicationDocumentsSection',
      documentTypes.designAccessStatement.name
    );
  });
});
