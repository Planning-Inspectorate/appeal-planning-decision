const { mockReq, mockRes } = require('../mocks');
const removeUnwantedCookiesMiddelware = require('../../../src/middleware/remove-unwanted-cookies');
const { removeUnwantedCookies } = require('../../../src/lib/remove-unwanted-cookies');
const cookieConfig = require('../../../src/lib/client-side/cookie/cookie-config');

jest.mock('../../../src/lib/remove-unwanted-cookies');

describe('middleware/remove-unwanted-cookies', () => {
  [
    {
      title: 'req.cookies is undefined',
      given: () => {
        const r = mockReq();
        delete r.cookies;
        return r;
      },
      expected: (req, res, next) => {
        expect(removeUnwantedCookies).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'req.cookies is set but the interesting key does not exist',
      given: () => mockReq(),
      expected: (req, res, next) => {
        expect(removeUnwantedCookies).toHaveBeenCalledWith(req, res);
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'req.cookies[cookieConfig.COOKIE_POLICY_KEY] is set but the value is not JSON',
      given: () => ({
        ...mockReq(),
        cookies: {
          [cookieConfig.COOKIE_POLICY_KEY]: 'this is not JSON!',
        },
      }),
      expected: (req, res, next) => {
        expect(removeUnwantedCookies).toHaveBeenCalledWith(req, res, ['connect.sid']);
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'req.cookies[cookieConfig.COOKIE_POLICY_KEY] is set and usage is enabled',
      given: () => ({
        ...mockReq(),
        cookies: {
          [cookieConfig.COOKIE_POLICY_KEY]: JSON.stringify({ usage: true }),
        },
      }),
      expected: (req, res, next) => {
        expect(removeUnwantedCookies).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'req.cookies[cookieConfig.COOKIE_POLICY_KEY] is set and usage is disabled',
      given: () => ({
        ...mockReq(),
        cookies: {
          [cookieConfig.COOKIE_POLICY_KEY]: JSON.stringify({ usage: false }),
        },
      }),
      expected: (req, res, next) => {
        expect(removeUnwantedCookies).toHaveBeenCalledWith(req, res);
        expect(next).toHaveBeenCalled();
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, async () => {
      const next = jest.fn();
      const req = given();
      const res = mockRes();

      await removeUnwantedCookiesMiddelware(req, res, next);

      expected(req, res, next);
    });
  });
});
