const { get, post } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const otherAppealsController = require('../../../src/controllers/other-appeals');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const { rules: otherAppealsValidationRules } = require('../../../src/validators/other-appeals');
const authenticateMiddleware = require('../../../src/middleware/authenticate');

jest.mock('../../../src/validators/other-appeals');

describe('routes/other-appeals', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/other-appeals');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/:id/${VIEW.OTHER_APPEALS}`,
      [authenticateMiddleware, fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
      otherAppealsController.getOtherAppeals
    );
    expect(post).toHaveBeenCalledWith(
      `/:id/${VIEW.OTHER_APPEALS}`,
      authenticateMiddleware,
      otherAppealsValidationRules(),
      validationErrorHandler,
      otherAppealsController.postOtherAppeals
    );
  });
});
