const { get, post } = require('../../router-mock');
const {
  getVisibleFromRoad,
  postVisibleFromRoad,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/visible-from-road');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');
const {
  rules: textfieldValidationRules,
} = require('../../../../../src/validators/common/textfield');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');
jest.mock('../../../../../src/validators/common/textfield');

describe('routes/full-appeal/submit-appeal/visible-from-road', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/visible-from-road');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/visible-from-road',
      [fetchExistingAppealMiddleware],
      getVisibleFromRoad
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/visible-from-road',
      optionsValidationRules(),
      textfieldValidationRules(),
      validationErrorHandler,
      postVisibleFromRoad
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'visible-from-road',
      emptyError: 'Select yes if the site is visible from a public road',
    });
    expect(textfieldValidationRules).toHaveBeenCalledWith({
      fieldName: 'visible-from-road-details',
      targetFieldName: 'visible-from-road',
      emptyError: 'Tell us how visibility is restricted',
      tooLongError: 'How visibility is restricted must be $maxLength characters or less',
    });
  });
});
