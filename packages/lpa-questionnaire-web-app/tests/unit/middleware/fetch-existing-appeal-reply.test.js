jest.mock('../../../src/lib/appeal-reply-api-wrapper');

const { mockReq, mockRes } = require('../mocks');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const {
  createOrUpdateAppealReply,
  getExistingAppealReply,
} = require('../../../src/lib/appeal-reply-api-wrapper');
const config = require('../../../src/config');

config.appealReply.url = 'http://fake.url';

describe('middleware/fetch-existing-appeal-reply', () => {
  [
    {
      title: 'call next immediately if no session',
      given: () => mockReq,
      expected: (req, res, next) => {
        expect(getExistingAppealReply).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set empty appeal reply and call next immediately if no appeal exists',
      given: () => ({
        ...mockReq(null),
      }),
      expected: (req, res, next) => {
        expect(getExistingAppealReply).not.toHaveBeenCalled();
        expect(createOrUpdateAppealReply).toHaveBeenCalledWith({});
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set empty appeal reply and call next immediately if no id set',
      given: () => ({
        ...mockReq(),
      }),
      expected: (req, res, next) => {
        expect(getExistingAppealReply).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'call next if api lookup fails',
      given: () => {
        getExistingAppealReply.mockRejectedValue('API is down');
        createOrUpdateAppealReply.mockReturnValue({ fake: 'appeal data' });
        return {
          ...mockReq(),
          session: {
            appealReply: {
              id: '123-abc',
            },
          },
        };
      },
      expected: (req, res, next) => {
        expect(getExistingAppealReply).toHaveBeenCalledWith('123-abc');
        expect(createOrUpdateAppealReply).toHaveBeenCalledWith({});
        expect(req.session.appeal).toEqual({ fake: 'appeal data' });
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set session.appealReply and call next if api call succeeds',
      given: () => {
        getExistingAppealReply.mockResolvedValue({ good: 'data' });

        return {
          ...mockReq(),
          session: {
            appealReply: {
              id: '123-abc',
            },
          },
        };
      },
      expected: (req, res, next) => {
        expect(getExistingAppealReply).toHaveBeenCalledWith('123-abc');
        expect(next).toHaveBeenCalled();
        expect(req.session.appealReply).toEqual({ good: 'data' });
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, async () => {
      const next = jest.fn();
      const req = given();

      await fetchExistingAppealReplyMiddleware(req, mockRes, next);

      expected(req, mockRes, next);
    });
  });
});
