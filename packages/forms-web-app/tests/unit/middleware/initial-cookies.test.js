const { mockReq, mockRes } = require('../mocks');
const initialCookiesMiddleware = require('../../../src/middleware/initial-cookies');
const { DEFAULT_COOKIE_POLICY } = require('../../../src/lib/cookies');

const cookiePolicyKey = 'cookie_policy';

describe('middleware/initial-cookies', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  [
    {
      title: 'call next immediately if req.cookies is not defined',
      given: () => ({
        req: mockReq(),
        res: mockRes(),
      }),
      expected: (req, res, next) => {
        expect(res.cookie).not.toHaveBeenCalled();
        expect(res.locals).toBeUndefined();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'call next immediately if req.cookies.cookie_policy is already defined',
      given: () => ({
        req: {
          ...mockReq(),
          cookies: {
            [cookiePolicyKey]: 'something',
          },
        },
        res: mockRes(),
      }),
      expected: (req, res, next) => {
        expect(res.cookie).not.toHaveBeenCalled();
        expect(res.locals).toBeUndefined();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set req.cookies.cookie_policy if not defined - when req.cookies is empty',
      given: () => ({
        req: {
          ...mockReq(),
          cookies: {},
        },
        res: {
          ...mockRes(),
          locals: {},
        },
      }),
      expected: (req, res, next) => {
        expect(res.cookie).toHaveBeenCalledWith(
          cookiePolicyKey,
          JSON.stringify(DEFAULT_COOKIE_POLICY),
          { encode: String }
        );
        expect(res.locals.cookies).toEqual({
          [cookiePolicyKey]: DEFAULT_COOKIE_POLICY,
        });
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set req.cookies.cookie_policy if not defined - when req.cookies is not empty',
      given: () => ({
        req: {
          ...mockReq(),
          cookies: {
            a: 'b',
          },
        },
        res: {
          ...mockRes(),
          locals: {},
        },
      }),
      expected: (req, res, next) => {
        expect(res.cookie).toHaveBeenCalledWith(
          cookiePolicyKey,
          JSON.stringify(DEFAULT_COOKIE_POLICY),
          { encode: String }
        );
        expect(res.locals.cookies).toEqual({
          a: 'b',
          [cookiePolicyKey]: DEFAULT_COOKIE_POLICY,
        });
        expect(next).toHaveBeenCalled();
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, async () => {
      const next = jest.fn();
      const { req, res } = given();

      await initialCookiesMiddleware(req, res, next);

      expected(req, res, next);
    });
  });
});
