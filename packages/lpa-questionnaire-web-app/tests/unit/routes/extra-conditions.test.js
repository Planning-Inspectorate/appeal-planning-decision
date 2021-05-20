const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { get, post } = require('./router-mock');
const extraConditionsController = require('../../../src/controllers/extra-conditions');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const {
  rules: extraConditionsValidationRules,
} = require('../../../src/validators/extra-conditions');

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
      `/:id/extra-conditions`,
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
      extraConditionsController.getExtraConditions
    );
    expect(post).toHaveBeenCalledWith(
      '/:id/extra-conditions',
      extraConditionsValidationRules(),
      validationErrorHandler,
      extraConditionsController.postExtraConditions
    );
  });
});
