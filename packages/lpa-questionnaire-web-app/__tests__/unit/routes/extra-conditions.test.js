const { get, post } = require('./router-mock');
const extraConditionsController = require('../../../src/controllers/extra-conditions');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/common/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/common/fetch-appeal');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const {
  rules: extraConditionsValidationRules,
} = require('../../../src/validators/extra-conditions');
const alreadySubmittedMiddleware = require('../../../src/middleware/already-submitted');

jest.mock('../../../src/validators/extra-conditions');

describe('routes/extra-conditions', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/extra-conditions');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/appeal-questionnaire/:id/extra-conditions`,
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
      extraConditionsController.getExtraConditions
    );

    expect(post).toHaveBeenCalledWith(
      '/appeal-questionnaire/:id/extra-conditions',
      extraConditionsValidationRules(),
      validationErrorHandler,
      extraConditionsController.postExtraConditions
    );
  });
});
