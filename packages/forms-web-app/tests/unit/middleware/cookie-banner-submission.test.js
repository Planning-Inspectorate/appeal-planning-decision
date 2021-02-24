const { mockReq, mockRes } = require('../mocks');
const { COOKIE_POLICY_KEY, DEFAULT_COOKIE_POLICY } = require('../../../src/lib/cookies');
const cookieBannerSubmissionMiddleware = require('../../../src/middleware/cookie-banner-submission');

describe('middleware/cookie-banner-submission', () => {
  let next;
  let res;

  beforeEach(() => {
    next = jest.fn();
    res = {
      ...mockRes(),
      locals: {},
    };

    jest.resetAllMocks();
  });

  afterEach(() => {
    expect(next).toHaveBeenCalled();
  });

  describe('fails pre-reqs - call next immediately', () => {
    [
      {
        title: 'req.body is not defined',
        given: () => mockReq(),
      },
      {
        title: 'req.body.cookie_banner is not defined',
        given: () => ({
          ...mockReq(),
          body: {
            a: 'b',
          },
        }),
      },
      {
        title: 'req.body.cookie_banner is an invalid value',
        given: () => ({
          ...mockReq(),
          body: {
            cookie_banner: 'some invalid value',
          },
        }),
      },
    ].forEach(({ title, given }) => {
      it(title, async () => {
        const req = given();

        await cookieBannerSubmissionMiddleware(req, res, next);

        expect(res.cookie).not.toHaveBeenCalled();
      });
    });
  });

  describe('cookiePolicy.usage', () => {
    const expectResCookieCall = (cookiePolicy) =>
      expect(res.cookie).toHaveBeenCalledWith(COOKIE_POLICY_KEY, JSON.stringify(cookiePolicy), {
        encode: String,
      });

    describe('req.cookies[COOKIE_POLICY_KEY] is not set', () => {
      [
        {
          title: 'set the expected cookie on reject',
          cookieBannerValue: 'reject',
          expectedUsageValue: false,
        },
        {
          title: 'set the expected cookie on accept',
          cookieBannerValue: 'accept',
          expectedUsageValue: true,
        },
      ].forEach(({ title, cookieBannerValue, expectedUsageValue }) => {
        it(title, async () => {
          const req = {
            ...mockReq(),
            body: {
              a: 'b',
              cookie_banner: cookieBannerValue,
            },
          };

          await cookieBannerSubmissionMiddleware(req, res, next);

          expectResCookieCall({
            ...DEFAULT_COOKIE_POLICY,
            usage: expectedUsageValue,
          });

          expect(res.locals.acceptedCookiePolicy).toEqual(expectedUsageValue);
          expect(res.locals.cookies).toEqual({
            ...req.cookies,
            cookies_preferences_set: true,
            [COOKIE_POLICY_KEY]: {
              ...DEFAULT_COOKIE_POLICY,
              usage: expectedUsageValue,
            },
          });
        });
      });
    });

    describe('req.cookies[COOKIE_POLICY_KEY] is set', () => {
      [
        {
          title: 'set the expected cookie on reject',
          cookieBannerValue: 'reject',
          expectedUsageValue: false,
        },
        {
          title: 'set the expected cookie on accept',
          cookieBannerValue: 'accept',
          expectedUsageValue: true,
        },
      ].forEach(({ title, cookieBannerValue, expectedUsageValue }) => {
        it(title, async () => {
          const cookiePolicy = {
            ...DEFAULT_COOKIE_POLICY,
            usage: expectedUsageValue,
            settings: false,
            campaigns: true,
          };

          const req = {
            ...mockReq(),
            body: {
              a: 'b',
              cookie_banner: cookieBannerValue,
            },
            cookies: {
              [COOKIE_POLICY_KEY]: JSON.stringify(cookiePolicy),
            },
          };

          await cookieBannerSubmissionMiddleware(req, res, next);

          expectResCookieCall({
            ...cookiePolicy,
            usage: expectedUsageValue,
          });

          expect(res.locals.acceptedCookiePolicy).toEqual(expectedUsageValue);
          expect(res.locals.cookies).toEqual({
            ...req.cookies,
            cookies_preferences_set: true,
            [COOKIE_POLICY_KEY]: cookiePolicy,
          });
        });
      });
    });
  });
});
