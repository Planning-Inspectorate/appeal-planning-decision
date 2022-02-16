const {
  constants: { PROCEDURE_TYPE },
} = require('@pins/business-rules');
const { get, post } = require('../../router-mock');
const {
  getHowDecideAppeal,
  postHowDecideAppeal,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/how-decide-appeal');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/how-decide-appeal', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/how-decide-appeal');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/how-decide-appeal',
      [fetchExistingAppealMiddleware],
      getHowDecideAppeal
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/how-decide-appeal',
      optionsValidationRules(),
      validationErrorHandler,
      postHowDecideAppeal
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'procedure-type',
      emptyError: 'Select how you would prefer us to decide your appeal',
      validOptions: Object.values(PROCEDURE_TYPE),
    });
  });
});
