const { get, post } = require('../../router-mock');
const {
  getNewPlansDrawings,
  postNewPlansDrawings,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/new-plans-drawings');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/new-plans-drawings', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/new-plans-drawings');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/new-plans-drawings',
      [fetchExistingAppealMiddleware],
      getNewPlansDrawings
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/new-plans-drawings',
      optionsValidationRules(),
      validationErrorHandler,
      postNewPlansDrawings
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'plans-drawings',
      emptyError: 'Select yes if you want to submit any new plans and drawings with your appeal',
    });
  });
});
