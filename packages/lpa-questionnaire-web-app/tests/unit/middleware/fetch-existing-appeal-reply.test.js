jest.mock('../../../src/lib/appeal-reply-api-wrapper');

const { mockReq, mockRes } = require('../mocks');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const {
  createAppealReply,
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
      title: 'set session.appealReply and call next if api call succeeds',
      given: () => {
        getExistingAppealReply.mockResolvedValue({ good: 'data' });

        return {
          ...mockReq(),
          params: {
            id: '123-abc',
          },
        };
      },
      expected: (req, res, next) => {
        expect(getExistingAppealReply).toHaveBeenCalledWith('123-abc');
        expect(next).toHaveBeenCalled();
        expect(req.session.appealReply).toEqual({ good: 'data' });
      },
    },
    {
      title:
        'just creates an appealReply anyway if we 404 - this goes at some point when the flow is complete',
      given: () => {
        getExistingAppealReply.mockRejectedValue({ status: 404 });
        createAppealReply.mockResolvedValue({ good: 'data' });

        return {
          ...mockReq(),
          params: {
            id: '123-abc',
          },
        };
      },
      expected: (req, res, next) => {
        expect(getExistingAppealReply).toHaveBeenCalledWith('123-abc');
        expect(createAppealReply).toHaveBeenCalledWith('123-abc');
        expect(next).toHaveBeenCalled();
        expect(req.session.appealReply).toEqual({ good: 'data' });
      },
    },
    {
      title: 'handles other errors nicely',
      given: () => {
        getExistingAppealReply.mockRejectedValue({ status: 400 });

        return {
          ...mockReq(),
          params: {
            id: '123-abc',
          },
        };
      },
      expected: (req, res, next) => {
        expect(getExistingAppealReply).toHaveBeenCalledWith('123-abc');
        expect(createAppealReply).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({ status: 400 });
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
