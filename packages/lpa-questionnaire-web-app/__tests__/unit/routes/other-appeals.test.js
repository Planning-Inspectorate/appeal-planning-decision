const { get, post } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const otherAppealsController = require('../../../src/controllers/other-appeals');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const alreadySubmittedMiddleware = require('../../../src/middleware/already-submitted');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const { rules: otherAppealsValidationRules } = require('../../../src/validators/other-appeals');

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
      `/appeal-questionnaire/:id/${VIEW.OTHER_APPEALS}`,
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
      otherAppealsController.getOtherAppeals
    );

    expect(post).toHaveBeenCalledWith(
      `/appeal-questionnaire/:id/${VIEW.OTHER_APPEALS}`,
      otherAppealsValidationRules(),
      validationErrorHandler,
      otherAppealsController.postOtherAppeals
    );
  });
});
