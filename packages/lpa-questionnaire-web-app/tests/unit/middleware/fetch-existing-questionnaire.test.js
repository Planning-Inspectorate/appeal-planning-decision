jest.mock('../../../src/lib/appeals-api-wrapper');

const { mockReq, mockRes } = require('../mocks');
const fetchExistingQuestionnaireMiddleware = require('../../../src/middleware/fetch-existing-questionnaire');
const {
  createOrUpdateQuestionnaire,
  getExistingQuestionnaire,
} = require('../../../src/lib/appeals-api-wrapper');
const config = require('../../../src/config');

config.appeals.url = 'http://fake.url';

describe('middleware/fetch-existing-questionnaire', () => {
  [
    {
      title: 'call next immediately if no session',
      given: () => mockReq,
      expected: (req, res, next) => {
        expect(getExistingQuestionnaire).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set empty questionnaire and call next immediately if no questionnaire exists',
      given: () => ({
        ...mockReq(null),
      }),
      expected: (req, res, next) => {
        expect(getExistingQuestionnaire).not.toHaveBeenCalled();
        expect(createOrUpdateQuestionnaire).toHaveBeenCalledWith({});
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set empty questionnaire and call next immediately if no id set',
      given: () => ({
        ...mockReq(),
      }),
      expected: (req, res, next) => {
        expect(getExistingQuestionnaire).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'call next if api lookup fails',
      given: () => {
        getExistingQuestionnaire.mockRejectedValue('API is down');
        createOrUpdateQuestionnaire.mockReturnValue({ fake: 'questionnaire data' });
        return {
          ...mockReq(),
          session: {
            questionnaire: {
              id: '123-abc',
            },
          },
        };
      },
      expected: (req, res, next) => {
        expect(getExistingQuestionnaire).toHaveBeenCalledWith('123-abc');
        expect(createOrUpdateQuestionnaire).toHaveBeenCalledWith({});
        expect(req.session.questionnaire).toEqual({ fake: 'questionnaire data' });
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set session.questionnaire and call next if api call succeeds',
      given: () => {
        getExistingQuestionnaire.mockResolvedValue({ good: 'data' });

        return {
          ...mockReq(),
          session: {
            questionnaire: {
              id: '123-abc',
            },
          },
        };
      },
      expected: (req, res, next) => {
        expect(getExistingQuestionnaire).toHaveBeenCalledWith('123-abc');
        expect(next).toHaveBeenCalled();
        expect(req.session.questionnaire).toEqual({ good: 'data' });
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, async () => {
      const next = jest.fn();
      const req = given();

      await fetchExistingQuestionnaireMiddleware(req, mockRes, next);

      expected(req, mockRes, next);
    });
  });
});
