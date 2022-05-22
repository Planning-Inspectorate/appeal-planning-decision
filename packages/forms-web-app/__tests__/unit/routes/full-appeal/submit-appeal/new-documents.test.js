const { get, post } = require('../../router-mock');
const {
  getNewSupportingDocuments,
  postNewSupportingDocuments,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/new-documents');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/new-documents', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/new-documents');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/new-documents',
      [fetchExistingAppealMiddleware],
      getNewSupportingDocuments
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/new-documents',
      optionsValidationRules(),
      validationErrorHandler,
      postNewSupportingDocuments
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'supporting-documents',
      emptyError: 'Select yes if you want to submit any new supporting documents with your appeal',
    });
  });
});
