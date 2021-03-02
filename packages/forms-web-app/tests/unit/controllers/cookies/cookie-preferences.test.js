const cookiePreferencesController = require('../../../../src/controllers/cookies/cookie-preferences');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = mockReq();
const res = mockRes();

describe('controllers/cookies/cookie-preferences', () => {
  describe('getCookiePreferences', () => {
    it('should call the correct template', () => {
      cookiePreferencesController.getCookiePreferences(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.COOKIES.COOKIE_PREFERENCES);
    });
  });
});
