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

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/file-upload');

describe('routes/full-appeal/submit-appeal/decision-letter', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/decision-letter');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/decision-letter',
      [fetchExistingAppealMiddleware],
      getDecisionLetter
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/decision-letter',
      fileUploadValidationRules(),
      validationErrorHandler,
      postDecisionLetter
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith('Select your decision letter');
  });
});
