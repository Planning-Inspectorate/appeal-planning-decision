const {
  constants: { KNOW_THE_OWNERS },
} = require('@pins/business-rules');
const { get, post } = require('../../router-mock');
const {
  getKnowTheOwners,
  postKnowTheOwners,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/know-the-owners');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');
const errorMessage = require('../../../../../src/lib/full-appeal/error-message/know-the-owners');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');
jest.mock('../../../../../src/lib/full-appeal/error-message/know-the-owners');

describe('routes/full-appeal/submit-appeal/know-the-owners', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/know-the-owners');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/know-the-owners',
      [fetchExistingAppealMiddleware],
      getKnowTheOwners
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/know-the-owners',
      optionsValidationRules(),
      validationErrorHandler,
      postKnowTheOwners
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'know-the-owners',
      validOptions: Object.values(KNOW_THE_OWNERS),
      emptyError: errorMessage,
    });
  });
});
