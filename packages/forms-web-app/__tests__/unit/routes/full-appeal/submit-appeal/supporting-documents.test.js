const { get, post } = require('../../router-mock');
const {
  getSupportingDocuments,
  postSupportingDocuments,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/supporting-documents');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/supporting-documents', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/supporting-documents');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/supporting-documents',
      [fetchExistingAppealMiddleware],
      getSupportingDocuments
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/supporting-documents',
      optionsValidationRules(),
      validationErrorHandler,
      postSupportingDocuments
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'supporting-documents',
      emptyError: 'Select yes if you want to submit any new supporting documents with your appeal',
    });
  });
});
