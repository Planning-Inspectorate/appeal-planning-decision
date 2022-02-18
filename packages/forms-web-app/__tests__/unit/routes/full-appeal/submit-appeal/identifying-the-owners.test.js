const { I_AGREE } = require('@pins/business-rules/src/constants');
const { get, post } = require('../../router-mock');
const {
  getIdentifyingTheOwners,
  postIdentifyingTheOwners,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/identifying-the-owners');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/identifying-the-owners', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/identifying-the-owners');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/identifying-the-owners',
      [fetchExistingAppealMiddleware],
      getIdentifyingTheOwners
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/identifying-the-owners',
      optionsValidationRules(),
      validationErrorHandler,
      postIdentifyingTheOwners
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'identifying-the-owners',
      validOptions: [I_AGREE],
      emptyError: `Confirm if you've attempted to identify the landowners`,
    });
  });
});
