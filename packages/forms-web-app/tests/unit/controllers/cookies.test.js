const cookiesController = require('../../../src/controllers/cookies');
const cookieConfig = require('../../../src/lib/client-side/cookie/cookie-config');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

describe('controllers/cookies', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      ...mockReq(),
      body: {},
      cookies: {},
    };
    res = mockRes();
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
    });

    it('should redirect on the happy path - with data submitted', () => {
      req = {
        ...req,
        body: {
          'usage-cookies': 'off',
        },
      };

      cookiesController.postCookies(req, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.COOKIES}`);
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
    });
  });
});
