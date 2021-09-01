const { get, post } = require('../router-mock');
const { booleanQuestionController } = require('../../../../src/controllers/question-type');
const fetchExistingAppealReplyMiddleware = require('../../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../../src/middleware/fetch-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const booleanQuestionRules = require('../../../../src/validators/question-type/boolean');

const mockQuestions = [
  {
    id: 'mockId',
    emptyError: 'Mock error',
    url: 'mock-url',
  },
];

jest.mock('../../../../src/validators/question-type/boolean');
jest.mock('../../../../src/lib/questionTypes', () => ({ booleanQuestions: mockQuestions }));

describe('routes/question-type/boolean', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/question-type/boolean');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/appeal-questionnaire/:id/mock-url`,
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
      expect.any(Function),
      booleanQuestionController.getBooleanQuestion
    );
    expect(post).toHaveBeenCalledWith(
      `/appeal-questionnaire/:id/mock-url`,
      booleanQuestionRules('Mock error'),
      validationErrorHandler,
      expect.any(Function),
      booleanQuestionController.postBooleanQuestion
    );
  });
});
