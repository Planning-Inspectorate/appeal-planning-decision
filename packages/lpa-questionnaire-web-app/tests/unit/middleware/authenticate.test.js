jest.mock('../../../src/auth/passportWrapper');
jest.mock('../../../src/lib/appeals-api-wrapper');
const passportWrapper = require('../../../src/services/authentication/passportWrapper');
const authenticate = require('../../../src/middleware/authenticate');
const ExpiredJWTError = require('../../../src/services/authentication/error/ExpiredJWTError');
const InvalidJWTError = require('../../../src/services/authentication/error/InvalidJWTError');
const { getAppeal } = require('../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../mocks');
const mockAppealReply = require('../mockAppealReply');

describe('middleware/is-user-authenticated-or-redirect', () => {
  let req;
  let res;
  let jwtPayload;

  const next = jest.fn();
  const userData = {
    lpaCode: 'E69999999',
    email: 'test@test.com',
  };

  beforeEach(() => {
    jest.resetAllMocks();

    req = mockReq();
    req.params.id = '89aa8504-773c-42be-bb68-029716ad9756';

    res = mockRes();

    jwtPayload = {
      exp: 1912235086000,
      userData,
    };
  });

  describe('with expired jwtToken that has correct user data', () => {
    it('should redirect user to :lpaCode/authentication/your-email page', async () => {
      passportWrapper.authenticate.mockRejectedValue(new ExpiredJWTError('', jwtPayload));

      await authenticate(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(
        '/E69999999/authentication/your-email/session-expired'
      );
    });
  });

  describe('with expired jwtToken with no user data', () => {
    it('should redirect to 404 error page', async () => {
      delete jwtPayload.userData;
      passportWrapper.authenticate.mockRejectedValue(new ExpiredJWTError('', jwtPayload));

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('with valid jwtToken that has correct user data', () => {
    it('should set the decoded jwt user data on the request', async () => {
      passportWrapper.authenticate.mockResolvedValue(jwtPayload);

      await authenticate(req, res, next);

      expect(req.userData).toEqual(userData);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('with valid jwtToken that does not contain user data', () => {
    it('should redirect to 404 error page', async () => {
      delete jwtPayload.userData;
      passportWrapper.authenticate.mockResolvedValue(jwtPayload);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('with InvalidJWTError error and req has an existing appealId path param', () => {
    it('should redirect to /:lpaCode/authentication/your-email page', async () => {
      getAppeal.mockResolvedValue(mockAppealReply);
      passportWrapper.authenticate.mockRejectedValue(new InvalidJWTError());

      await authenticate(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(
        `/${mockAppealReply.lpaCode}/authentication/your-email`
      );
    });
  });

  describe('with InvalidJWTError error and req has no appealId path param', () => {
    it('should redirect to 404 error page', async () => {
      delete req.params.id;
      getAppeal.mockResolvedValue(mockAppealReply);
      passportWrapper.authenticate.mockRejectedValue(new InvalidJWTError());

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('with InvalidJWTError error and req has invalid appealId path param', () => {
    it('should redirect to 404 error page', async () => {
      req.params.id = 'appealId';
      passportWrapper.authenticate.mockRejectedValue(new InvalidJWTError());

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('with InvalidJWTError error and req has nonexistent appealId path param', () => {
    it('should redirect to 404 error page', async () => {
      passportWrapper.authenticate.mockRejectedValue(new InvalidJWTError());
      getAppeal.mockResolvedValue({
        code: 404,
        errors: ['The appeal 89aa8504-773c-42be-bb68-029716ad9756 was not found'],
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('with InvalidJWTError error and Appeal API is down', () => {
    it('should redirect to 404 error page', async () => {
      passportWrapper.authenticate.mockRejectedValue(new InvalidJWTError());
      getAppeal.mockRejectedValue(new Error('API is down'));

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
