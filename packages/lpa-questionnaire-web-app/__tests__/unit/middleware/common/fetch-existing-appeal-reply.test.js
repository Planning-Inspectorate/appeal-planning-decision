jest.mock('../../../../src/lib/appeal-reply-api-wrapper');

const { mockReq, mockRes } = require('../../mocks');
const fetchExistingAppealReplyMiddleware = require('../../../../src/middleware/common/fetch-existing-appeal-reply');
const {
  createOrUpdateAppealReply,
  getAppealReplyByAppeal,
} = require('../../../../src/lib/appeal-reply-api-wrapper');
const config = require('../../../../src/config');

config.appealReply.url = 'http://fake.url';
const appealId = '6546a75e-6e8b-4c47-ad53-c4ed7e634638';

describe('middleware/fetch-existing-appeal-reply', () => {
  [
    {
      title: 'call 404 error if no appeal ID',
      given: () => ({
        ...mockReq(),
        params: {},
      }),
      expected: (_, res, next) => {
        expect(getAppealReplyByAppeal).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
      },
    },
    {
      title: 'call 404 error if invalid appeal ID',
      given: mockReq,
      expected: (_, res, next) => {
        expect(getAppealReplyByAppeal).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
      },
    },
    {
      title: 'call 404 error if api lookup fails and allowCreate is false',
      given: () => {
        getAppealReplyByAppeal.mockRejectedValue('No reply found');
        createOrUpdateAppealReply.mockReturnValue({ fake: 'appeal data' });
        return {
          ...mockReq(),
          params: {
            id: appealId,
          },
        };
      },
      allowCreate: false,
      expected: (req, res, next) => {
        expect(getAppealReplyByAppeal).toHaveBeenCalledWith(appealId);
        expect(createOrUpdateAppealReply).not.toHaveBeenCalled();
        expect(req.session.appealReply).toEqual(undefined);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
      },
    },
    {
      title: 'calls createOrUpdate if api lookup fails and allowCreate is true',
      given: () => {
        getAppealReplyByAppeal.mockRejectedValue('No reply found');
        createOrUpdateAppealReply.mockReturnValue({ fake: 'appeal data' });
        return {
          ...mockReq(),
          params: {
            id: appealId,
          },
        };
      },
      expected: (req, _, next) => {
        expect(getAppealReplyByAppeal).toHaveBeenCalledWith(appealId);
        expect(createOrUpdateAppealReply).toHaveBeenCalledWith({ appealId });
        expect(req.session.appealReply).toEqual({ fake: 'appeal data' });
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set locals.appealReply and call next if api call succeeds',
      given: () => {
        getAppealReplyByAppeal.mockResolvedValue({ good: 'data' });

        return {
          ...mockReq(),
          params: {
            id: appealId,
          },
        };
      },
      expected: (req, _, next) => {
        expect(getAppealReplyByAppeal).toHaveBeenCalledWith(appealId);
        expect(next).toHaveBeenCalled();
        expect(req.session.appealReply).toEqual({ good: 'data' });
      },
    },
  ].forEach(({ title, given, expected, allowCreate = true }) => {
    it(title, async () => {
      const next = jest.fn();
      const req = given();
      const res = mockRes();

      // ensures clear session for each test
      req.session = {};

      config.appealReply.allowCreate = allowCreate;

      await fetchExistingAppealReplyMiddleware(req, res, next);

      expected(req, res, next);
    });
  });
});
