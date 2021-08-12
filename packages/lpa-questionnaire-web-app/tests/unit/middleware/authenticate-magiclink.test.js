jest.mock('../../../src/auth/passportWrapper');
process.env.MAGIC_LINK_CRYPTO_KEY = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

const passportWrapper = require('../../../src/auth/passportWrapper');
const crypto = require('../../../src/auth/lib/crypto');
const authenticateMagicLink = require('../../../src/middleware/authenticate-magiclink');
const ExpiredJWTError = require('../../../src/auth/error/ExpiredJWTError');
const InvalidJWTError = require('../../../src/auth/error/InvalidJWTError');
const { mockReq, mockRes } = require('../mocks');

describe('middleware/get-magiclink-token-data', () => {
  let req;
  let res;
  let jwtPayload;

  const next = jest.fn();
  const userData = {
    lpaCode: 'E69999999',
    redirectURL: '/15549118-106f-4394-95c6-c63887b7d4c9/task-list',
    email: 'test@test.com',
  };

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jwtPayload = {
      exp: 1912235086000,
      userData: crypto.encrypt(JSON.stringify(userData), process.env.MAGIC_LINK_CRYPTO_KEY),
    };
  });

  describe('with expired jwtToken that has correctly encoded user data', () => {
    it('should redirect user to :lpaCode/authentication/your-email page', async () => {
      passportWrapper.authenticate.mockRejectedValue(new ExpiredJWTError('', jwtPayload));

      await authenticateMagicLink(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(
        '/E69999999/authentication/your-email/link-expired'
      );
    });
  });

  describe('with expired jwtToken with no user data', () => {
    it('should redirect to 404 error page', async () => {
      delete jwtPayload.userData;
      passportWrapper.authenticate.mockRejectedValue(new ExpiredJWTError('', jwtPayload));

      await authenticateMagicLink(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('with valid jwtToken that has correctly encoded user data', () => {
    it('should set the decoded jwt user data on the request', async () => {
      passportWrapper.authenticate.mockResolvedValue(jwtPayload);

      await authenticateMagicLink(req, res, next);

      expect(req.userData).toEqual(userData);
    });
  });

  describe('with valid jwtToken that has incorrectly encoded user data', () => {
    it('should redirect to error page', async () => {
      jwtPayload.userData = '1581';
      passportWrapper.authenticate.mockResolvedValue(jwtPayload);

      await authenticateMagicLink(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('with valid jwtToken that does not contain user data', () => {
    it('should redirect to error page', async () => {
      delete jwtPayload.userData;
      passportWrapper.authenticate.mockResolvedValue(jwtPayload);

      await authenticateMagicLink(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('with no token token and InvalidJWTError', () => {
    it('should redirect to error page', async () => {
      passportWrapper.authenticate.mockRejectedValue(new InvalidJWTError());

      await authenticateMagicLink(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
