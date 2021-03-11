const {
  defaultKeepMeCookies,
  removeUnwantedCookies,
} = require('../../../src/lib/remove-unwanted-cookies');
const { mockReq, mockRes } = require('../mocks');
const cookieConfig = require('../../../src/lib/client-side/cookie/cookie-config');

describe('lib/remove-unwanted-cookies', () => {
  describe('defaultKeepMeCookies', () => {
    it('should have the expected cookie names', () => {
      expect(defaultKeepMeCookies).toEqual(['connect.sid', cookieConfig.COOKIE_POLICY_KEY]);
    });
  });

  describe('removeUnwantedCookies', () => {
    const fakeSessionId = 'abc-xyz-123';

    [
      {
        title: 'no existing cookies',
        given: {
          req: mockReq(),
          res: mockRes(),
          keepTheseCookies: undefined,
        },
        expected: (res) => {
          expect(res.clearCookie).not.toHaveBeenCalled();
        },
      },
      {
        title: 'retains session cookie',
        given: {
          req: {
            ...mockReq(),
            cookies: {
              'connect.sid': fakeSessionId,
            },
          },
          res: mockRes(),
          keepTheseCookies: undefined,
        },
        expected: (res) => {
          expect(res.clearCookie).not.toHaveBeenCalled();
        },
      },
      {
        title: 'can force session cookie removal if explicitly excluded in keepTheseCookies',
        given: {
          req: {
            ...mockReq(),
            cookies: {
              'connect.sid': fakeSessionId,
            },
          },
          res: mockRes(),
          keepTheseCookies: [],
        },
        expected: (res) => {
          expect(res.clearCookie).toHaveBeenCalledTimes(1);
          expect(res.clearCookie).toHaveBeenCalledWith('connect.sid');
        },
      },
      {
        title: `retains ${[cookieConfig.COOKIE_POLICY_KEY]}`,
        given: {
          req: {
            ...mockReq(),
            cookies: {
              [cookieConfig.COOKIE_POLICY_KEY]: { a: 'b' },
            },
          },
          res: mockRes(),
          keepTheseCookies: undefined,
        },
        expected: (res) => {
          expect(res.clearCookie).not.toHaveBeenCalled();
        },
      },
      {
        title: `can force ${[
          cookieConfig.COOKIE_POLICY_KEY,
        ]} removal if explicitly excluded in keepTheseCookies`,
        given: {
          req: {
            ...mockReq(),
            cookies: {
              [cookieConfig.COOKIE_POLICY_KEY]: { a: 'b' },
            },
          },
          res: mockRes(),
          keepTheseCookies: [],
        },
        expected: (res) => {
          expect(res.clearCookie).toHaveBeenCalledTimes(1);
          expect(res.clearCookie).toHaveBeenCalledWith(cookieConfig.COOKIE_POLICY_KEY);
        },
      },
      {
        title: `removes and retains expected with defaults`,
        given: {
          req: {
            ...mockReq(),
            cookies: {
              'connect.sid': fakeSessionId,
              [cookieConfig.COOKIE_POLICY_KEY]: { a: 'b' },
              'some-unwanted-cookie': 'i am unwanted :(',
            },
          },
          res: mockRes(),
          keepTheseCookies: undefined,
        },
        expected: (res) => {
          expect(res.clearCookie).toHaveBeenCalledTimes(1);
          expect(res.clearCookie).toHaveBeenCalledWith('some-unwanted-cookie');
        },
      },
      {
        title: `removes and retains expected with custom keepTheseCookies`,
        given: {
          req: {
            ...mockReq(),
            cookies: {
              'connect.sid': fakeSessionId,
              [cookieConfig.COOKIE_POLICY_KEY]: { a: 'b' },
              'some-unwanted-cookie': 'i am unwanted :(',
            },
          },
          res: mockRes(),
          keepTheseCookies: ['some-unwanted-cookie'],
        },
        expected: (res) => {
          expect(res.clearCookie).toHaveBeenCalledTimes(2);
          expect(res.clearCookie).toHaveBeenCalledWith('connect.sid');
          expect(res.clearCookie).toHaveBeenCalledWith(cookieConfig.COOKIE_POLICY_KEY);
        },
      },
      {
        title: `removes and retains expected with real world looking setup`,
        given: {
          req: {
            ...mockReq(),
            cookies: {
              'connect.sid':
                's%3Avh3SpX2LGpPS77Do2F0WVt4Gz3FaKP7t.CBnhpm4ua8zP4kXqnXjBC%2BH9%2FOlW%2BNPnuR155nAxvAE',
              _ga_TZBWMVPTHV: 'GS1.1.1615458372.1.1.1615458496.0',
              [cookieConfig.COOKIE_POLICY_KEY]: {
                essential: true,
                settings: false,
                usage: false,
                campaigns: false,
              },
              _ga: 'GA1.1.1786687680.1615458372',
            },
          },
          res: mockRes(),
          keepTheseCookies: undefined,
        },
        expected: (res) => {
          expect(res.clearCookie).toHaveBeenCalledTimes(2);
          expect(res.clearCookie).toHaveBeenCalledWith('_ga_TZBWMVPTHV');
          expect(res.clearCookie).toHaveBeenCalledWith('_ga');
        },
      },
    ].forEach(({ title, given: { req, res, keepTheseCookies }, expected }) => {
      it(`should retain the expected cookies - ${title}`, () => {
        removeUnwantedCookies(req, res, keepTheseCookies);
        expected(res);
      });
    });
  });
});
