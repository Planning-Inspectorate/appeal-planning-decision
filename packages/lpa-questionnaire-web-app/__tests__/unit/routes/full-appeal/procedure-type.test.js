const { get, post } = require('../router-mock');
const procedureTypeController = require('../../../../src/controllers/full-appeal/procedure-type');
const fetchExistingAppealReplyMiddleware = require('../../../../src/middleware/common/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../../src/middleware/common/fetch-appeal');
const alreadySubmittedMiddleware = require('../../../../src/middleware/already-submitted');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: procedureTypeValidationRules,
} = require('../../../../src/validators/full-appeal/procedure-type');

jest.mock('../../../../src/validators/full-appeal/procedure-type');

describe('routes/full-appeal/procedure-type', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal/procedure-type');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/full-appeal/:id/procedure-type`,
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
      procedureTypeController.getProcedureType
    );

    expect(post).toHaveBeenCalledWith(
      `/full-appeal/:id/procedure-type`,
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
      procedureTypeValidationRules(),
      validationErrorHandler,
      procedureTypeController.postProcedureType
    );
  });
});
