jest.mock('../../../src/lib/appeals-api-wrapper');
jest.mock('../../../src/lib/appeals-api-wrapper', () => ({
  getAppeal: jest.fn(),
}));

const { mockReq, mockRes } = require('../mocks');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const { getAppeal } = require('../../../src/lib/appeals-api-wrapper');
const config = require('../../../src/config');

config.appeals.url = 'http://fake.url';

describe('middleware/fetch-appeal', () => {
  [
    {
      title: 'call next immediately if no session',
      given: () => mockReq,
      expected: (req, res, next) => {
        expect(getAppeal).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'call next immediately if no id in url',
      given: () => ({
        ...mockReq(null),
      }),
      expected: (req, res, next) => {
        expect(getAppeal).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'if appeal id in session, API is not called',
      given: () => ({
        session: {
          appeal: {
            id: '123-abc',
          },
        },
      }),
      expected: (req, res, next) => {
        expect(getAppeal).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'call next if api lookup fails',
      given: () => {
        getAppeal.mockRejectedValue('API is down');
        return {
          ...mockReq(),
          params: {
            id: '123-abc',
          },
        };
      },
      expected: (req, res, next) => {
        expect(getAppeal).toHaveBeenCalledWith('123-abc');
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set session.appeal and call next if api call succeeds',
      given: () => {
        getAppeal.mockResolvedValue({ good: 'data' });

        return {
          ...mockReq(),
          params: {
            id: '123-abc',
          },
        };
      },
      expected: (req, res, next) => {
        expect(getAppeal).toHaveBeenCalledWith('123-abc');
        expect(next).toHaveBeenCalled();
        expect(req.session.appeal).toEqual({ good: 'data' });
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, async () => {
      const next = jest.fn();
      const req = given();

      await fetchAppealMiddleware(req, mockRes, next);

      expected(req, mockRes, next);
    });
  });
});
