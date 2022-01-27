jest.mock('../../../../src/lib/appeals-api-wrapper');

const { mockReq, mockRes } = require('../../mocks');
const fetchAppealMiddleware = require('../../../../src/middleware/common/fetch-appeal');
const { getAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const config = require('../../../../src/config');

config.appeals.url = 'http://fake.url';
const appealId = '6546a75e-6e8b-4c47-ad53-c4ed7e634638';

describe('middleware/fetch-appeal', () => {
  let response;

  beforeEach(() => {
    jest.resetAllMocks();
    response = mockRes();
  });

  [
    {
      title: 'call 404 error if no appeal ID',
      given: () => ({
        ...mockReq(),
        params: {},
      }),
      expected: (_, res, next) => {
        expect(getAppeal).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
      },
    },
    {
      title: 'call 404 error if invalid appeal ID',
      given: mockReq,
      expected: (_, res, next) => {
        expect(getAppeal).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
      },
    },
    {
      title: 'call 404 error if api lookup fails',
      given: () => {
        getAppeal.mockRejectedValue('API is down');
        return {
          ...mockReq(),
          params: {
            id: appealId,
          },
        };
      },
      expected: (_, res, next) => {
        expect(getAppeal).toHaveBeenCalledWith(appealId);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
      },
    },
    {
      title: 'set session.appealReply and call next if api call succeeds',
      given: () => {
        getAppeal.mockResolvedValue({ good: 'data' });

        return {
          ...mockReq(),
          params: {
            id: appealId,
          },
        };
      },
      expected: (req, _, next) => {
        expect(getAppeal).toHaveBeenCalledWith(appealId);
        expect(next).toHaveBeenCalled();
        expect(req.session.appeal).toEqual({ good: 'data' });
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, async () => {
      const next = jest.fn();
      const req = given();

      await fetchAppealMiddleware(req, response, next);

      expected(req, response, next);
    });
  });
});
