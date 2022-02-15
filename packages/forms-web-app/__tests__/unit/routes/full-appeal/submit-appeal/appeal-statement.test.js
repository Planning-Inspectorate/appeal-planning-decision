const { documentTypes } = require('@pins/common');
const { get, post } = require('../../router-mock');
const {
  getAppealStatement,
  postAppealStatement,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/appeal-statement');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: appealStatementValidationRules,
} = require('../../../../../src/validators/common/appeal-statement');
const setSectionAndTaskNames = require('../../../../../src/middleware/set-section-and-task-names');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/appeal-statement');
jest.mock('../../../../../src/middleware/set-section-and-task-names');

describe('routes/full-appeal/submit-appeal/appeal-statement', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/appeal-statement');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/appeal-statement',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getAppealStatement
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/appeal-statement',
      setSectionAndTaskNames(),
      appealStatementValidationRules(),
      validationErrorHandler,
      postAppealStatement
    );
    expect(appealStatementValidationRules).toHaveBeenCalledWith('Select your appeal statement');
    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'appealDocumentsSection',
      documentTypes.appealStatement.name
    );
  });
});
