const cookiesController = require('../../../src/controllers/cookies');
const cookieConfig = require('../../../src/lib/client-side/cookie/cookie-config');
const appConfig = require('../../../src/config');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/config');

describe('controllers/cookies', () => {
  const FIXED_SYSTEM_TIME = '2020-11-18T00:00:00Z';

  let req;
  let res;

  beforeEach(() => {
    jest.resetAllMocks();

    req = {
      ...mockReq(),
      body: {},
      cookies: {},
    };
    res = mockRes();

    // https://github.com/facebook/jest/issues/2234#issuecomment-730037781
    jest.useFakeTimers('modern');
    jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getCookies', () => {
    it('should not throw if cannot parse req.cookies value', () => {
      req.cookies[cookieConfig.COOKIE_POLICY_KEY] = 'blurgh';

      cookiesController.getCookies(req, res);

      expect(req.log.warn).toHaveBeenCalledWith(
        new SyntaxError('Unexpected token b in JSON at position 0'),
        'Get cookies.'
      );

      expect(res.render).toHaveBeenCalledWith(VIEW.COOKIES, {
        cookiePolicy: {},
      });
    });

    it('should call the correct template', () => {
      cookiesController.getCookies(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.COOKIES, {
        cookiePolicy: undefined,
      });
    });
  });

  describe('postCookies', () => {
    it('should redirect on the happy path - no data submitted', () => {
      cookiesController.postCookies(req, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.COOKIES}`);

      expect(res.cookie).not.toHaveBeenCalled();
    });

    it('calls the correct template on error', () => {
      req = {
        ...req,
        body: {
          errors: { a: 'b' },
        },
      };

      cookiesController.postCookies(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.COOKIES, {
        cookiePolicy: undefined,
      });

      expect(res.cookie).not.toHaveBeenCalled();
    });

    describe('should redirect on the happy path', () => {
      const resCookieCallTest = (usage, secure) => {
        expect(res.cookie).toHaveBeenCalledWith(
          cookieConfig.COOKIE_POLICY_KEY,
          JSON.stringify({
            ...cookieConfig.DEFAULT_COOKIE_POLICY,
            usage,
          }),
          { encode: String, expires: new Date('2120-10-25T00:00:00.000Z'), secure }
        );
      };

      [
        {
          description: 'Not in production, disable usage cookies',
          before: () => {
            appConfig.isProduction = false;
          },
          setupReq: () => ({
            ...req,
            body: {
              'usage-cookies': 'off',
            },
          }),
          runExtraAssertions: () => resCookieCallTest(false, false),
        },
        {
          description: 'Not in production, enable usage cookies',
          before: () => {
            appConfig.isProduction = false;
          },
          setupReq: () => ({
            ...req,
            body: {
              'usage-cookies': 'on',
            },
          }),
          runExtraAssertions: () => resCookieCallTest(true, false),
        },
        {
          description: 'In production, disable usage cookies',
          before: () => {
            appConfig.isProduction = true;
          },
          setupReq: () => ({
            ...req,
            body: {
              'usage-cookies': 'off',
            },
          }),
          runExtraAssertions: () => resCookieCallTest(false, true),
        },
        {
          description: 'In production,  enable usage cookies',
          before: () => {
            appConfig.isProduction = true;
          },
          setupReq: () => ({
            ...req,
            body: {
              'usage-cookies': 'on',
            },
          }),
          runExtraAssertions: () => resCookieCallTest(true, true),
        },
      ].forEach(({ description, before, setupReq, runExtraAssertions }) => {
        test(`with data submitted - ${description}`, () => {
          before();
          req = setupReq();

          cookiesController.postCookies(req, res);

          expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.COOKIES}`);

          runExtraAssertions();
        });
      });

      afterEach(() => {
        appConfig.isProduction = false;
      });
    });
  });
});
