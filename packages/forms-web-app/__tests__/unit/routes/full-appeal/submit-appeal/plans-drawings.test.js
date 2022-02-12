const { get, post } = require('../../router-mock');
const {
  getPlansDrawings,
  postPlansDrawings,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/plans-drawings');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/plans-drawings', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/plans-drawings');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/plans-drawings',
      [fetchExistingAppealMiddleware],
      getPlansDrawings
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/plans-drawings',
      optionsValidationRules(),
      validationErrorHandler,
      postPlansDrawings
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'plans-drawings',
      emptyError: 'Select yes if you want to submit any new plans and drawings with your appeal',
    });
  });
});
