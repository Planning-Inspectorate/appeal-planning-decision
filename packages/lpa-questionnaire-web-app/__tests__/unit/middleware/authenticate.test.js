jest.mock('../../../src/services/authentication/authentication.service');
jest.mock('../../../src/lib/appeals-api-wrapper');
const mockAuthenticationService = require('../../../src/services/authentication/authentication.service');
const mockAppealsApiWrapper = require('../../../src/lib/appeals-api-wrapper');

const authenticate = require('../../../src/middleware/authenticate');
const ExpiredTokenError = require('../../../src/services/authentication/error/ExpiredTokenError');
const InvalidTokenError = require('../../../src/services/authentication/error/InvalidTokenError');

const { mockReq, mockRes } = require('../mocks');
const mockAppealReply = require('../mockAppealReply');

describe('middleware/authenticate', () => {
  let req;
  let res;
  let jwtPayload;

  const next = jest.fn();
  const userInformation = {
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
      userInformation,
    };
  });

  it('should redirect user to /appeal-questionnaire/:lpaCode/authentication/your-email page if jwtToken is expired', async () => {
    mockAuthenticationService.authenticate.mockRejectedValue(new ExpiredTokenError('', jwtPayload));

    await authenticate(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith(
      '/appeal-questionnaire/E69999999/authentication/your-email/session-expired'
    );
  });

  it('should redirect to 404 error page if jwtToken is expired and token payload does not contain lpa code', async () => {
    mockAuthenticationService.authenticate.mockRejectedValue(new ExpiredTokenError('', {}));

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should set the decoded jwt user information on the request if jwtToken is valid', async () => {
    mockAuthenticationService.authenticate.mockResolvedValue(jwtPayload);

    await authenticate(req, res, next);

    expect(req.userInformation).toEqual(userInformation);
    expect(next).toHaveBeenCalled();
  });

  describe('with InvalidTokenError error', () => {
    it('should redirect to /appeal-questionnaire/:lpaCode/authentication/your-email page if req has an existing appealId path param', async () => {
      mockAppealsApiWrapper.getAppeal.mockResolvedValue(mockAppealReply);
      mockAuthenticationService.authenticate.mockRejectedValue(new InvalidTokenError());

      await authenticate(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(
        `/appeal-questionnaire/${mockAppealReply.lpaCode}/authentication/your-email`
      );
    });

    it('should redirect to 404 error page if req has an invalid appealId path param', async () => {
      req.params.id = 'invalidAppealId';
      mockAuthenticationService.authenticate.mockRejectedValue(new InvalidTokenError());

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should redirect to 404 error page if req has nonexistent appealId path param', async () => {
      mockAuthenticationService.authenticate.mockRejectedValue(new InvalidTokenError());
      mockAppealsApiWrapper.getAppeal.mockResolvedValue({
        code: 404,
        errors: ['The appeal 89aa8504-773c-42be-bb68-029716ad9756 was not found'],
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should redirect to 404 error page if Appeal API is down', async () => {
      mockAuthenticationService.authenticate.mockRejectedValue(new InvalidTokenError());
      mockAppealsApiWrapper.getAppeal.mockRejectedValue(new Error('API is down'));

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
