const { get, post } = require('../../router-mock');
const {
  getAgriculturalHolding,
  postAgriculturalHolding,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/agricultural-holding');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/agricultural-holding', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/agricultural-holding');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/agricultural-holding',
      [fetchExistingAppealMiddleware],
      getAgriculturalHolding
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/agricultural-holding',
      optionsValidationRules(),
      validationErrorHandler,
      postAgriculturalHolding
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'agricultural-holding',
      emptyError: 'Select yes if the appeal site is part of an agricultural holding',
    });
  });
});
