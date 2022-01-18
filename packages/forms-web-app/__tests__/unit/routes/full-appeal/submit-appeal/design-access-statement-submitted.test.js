const { get, post } = require('../../router-mock');
const {
  getDesignAccessStatementSubmitted,
  postDesignAccessStatementSubmitted,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/design-access-statement-submitted');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: yesNoValidationRules } = require('../../../../../src/validators/common/yes-no');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/yes-no');

describe('routes/full-appeal/submit-appeal/design-access-statement-submitted', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/design-access-statement-submitted');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/design-access-statement-submitted',
      [fetchExistingAppealMiddleware],
      getDesignAccessStatementSubmitted
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/design-access-statement-submitted',
      yesNoValidationRules(),
      validationErrorHandler,
      postDesignAccessStatementSubmitted
    );
    expect(yesNoValidationRules).toHaveBeenCalledWith(
      'design-access-statement-submitted',
      'Select yes if you submitted a design and access statement with your application'
    );
  });
});
