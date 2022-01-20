const { documentTypes } = require('@pins/common');
const { get, post } = require('../../router-mock');
const {
  getDecisionLetter,
  postDecisionLetter,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/decision-letter');
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

describe('routes/full-appeal/submit-appeal/decision-letter', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/decision-letter');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/decision-letter',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getDecisionLetter
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/decision-letter',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postDecisionLetter
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith('Select your decision letter');
    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'planningApplicationDocumentsSection',
      documentTypes.decisionLetter.name
    );
  });
});
