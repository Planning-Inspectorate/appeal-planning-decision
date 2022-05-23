const { documentTypes } = require('@pins/common');
const { get, post } = require('../../router-mock');
const {
  getLetterConfirmingApplication,
  postLetterConfirmingApplication,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/letter-confirming-application');
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

describe('routes/full-appeal/submit-appeal/application-form', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/letter-confirming-application');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/letter-confirming-application',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getLetterConfirmingApplication
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/letter-confirming-application',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postLetterConfirmingApplication
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith(
      'Select your original decision notice file'
    );
    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'planningApplicationDocumentsSection',
      documentTypes.letterConfirmingApplication.name
    );
  });
});