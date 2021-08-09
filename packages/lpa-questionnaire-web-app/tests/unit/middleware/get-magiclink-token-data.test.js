jest.mock('passport');
process.env.CRYPTO_KEY = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

const passport = require('passport');
const crypto = require('../../../src/lib/crypto');
const getDataFromMagicLinkToken = require('../../../src/middleware/get-magiclink-jwt-data');
const { mockReq, mockRes } = require('../mocks');

function mockPassportAuthenticate(error, response) {
  passport.authenticate = jest.fn((authType, callback) => () => {
    callback(null, response);
  });
}

describe('middleware/get-magiclink-token-data', () => {
  let req;
  let res;
  let jwtPayload;

  const next = jest.fn();
  const userData = {
    lpaCode: 'E69999999',
    redirectURL: '/5ff2de67-7dc1-4ff2-824c-43740c3a1c7a/task-list',
    email: 'test@test.com',
  };

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jwtPayload = {
      exp: 1912235086000,
      userData: crypto.encrypt(JSON.stringify(userData)),
    };
  });

  describe('with expired jwtToken that has correctly encoded user data', () => {
    it('should redirect user to :lpaCode/authentication/your-email page', async () => {
      jwtPayload.exp = '1581368517';
      mockPassportAuthenticate(null, jwtPayload);

      getDataFromMagicLinkToken(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(
        '/E69999999/authentication/your-email/link-expired'
      );
    });
  });

  describe('with valid jwtToken that has correctly encoded user data', () => {
    it('should set the decoded jwt user data on the request', async () => {
      mockPassportAuthenticate(null, jwtPayload);

      getDataFromMagicLinkToken(req, res, next);

      expect(req.userData).toEqual(userData);
    });
  });

  describe('with valid jwtToken that has incorrectly encoded user data', () => {
    it('should redirect to error page', async () => {
      jwtPayload.userData = '1581';
      mockPassportAuthenticate(null, jwtPayload);

      getDataFromMagicLinkToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('with valid jwtToken that does not contain user data', () => {
    it('should redirect to error page', async () => {
      delete jwtPayload.userData;
      mockPassportAuthenticate(null, jwtPayload);

      getDataFromMagicLinkToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('with no token', () => {
    it('should redirect to error page', async () => {
      mockPassportAuthenticate('Invalid token', null);

      getDataFromMagicLinkToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
