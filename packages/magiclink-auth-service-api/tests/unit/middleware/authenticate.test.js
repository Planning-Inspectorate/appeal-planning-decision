jest.mock('../../../src/service/authenticationService');
jest.mock('../../../src/mappers/magicLinkTokenMapper');

const ExpiredTokenError = require('../../../src/service/error/ExpiredTokenError');
const InvalidTokenError = require('../../../src/service/error/InvalidTokenError');
const mockAuthenticationService = require('../../../src/service/authenticationService');
const mockMagicLinkTokenMapper = require('../../../src/mappers/magicLinkTokenMapper');
const authenticate = require('../../../src/middleware/authenticate');

const mockMagicLinkData = require('../../resources/magicLinkData.json');
const { mockReq, mockRes } = require('../mocks');

describe('middleware.authenticate', () => {
  let req;
  let res;

  const next = jest.fn();
  const mockTokenPayload = { exp: 12434, data: 'mockEncryptedData' };

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    mockMagicLinkTokenMapper.tokenToMagicLinkData.mockReturnValue(mockMagicLinkData);
  });

  describe('with expired jwtToken', () => {
    it('should redirect user to token payload attribute value "expiredLinkRedirectURL"', async () => {
      mockAuthenticationService.authenticate.mockRejectedValue(
        new ExpiredTokenError('', mockTokenPayload),
      );

      await authenticate(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(mockMagicLinkData.magicLink.expiredLinkRedirectURL);
    });
  });

  describe('with valid jwtToken', () => {
    it('should set the decoded jwt user data on the request', async () => {
      mockAuthenticationService.authenticate.mockResolvedValue(mockTokenPayload);

      await authenticate(req, res, next);

      expect(req.magicLinkData).toEqual(mockMagicLinkData);
    });
  });

  describe('with invalid token', () => {
    it('should redirect to error page', async () => {
      mockAuthenticationService.authenticate.mockRejectedValue(new InvalidTokenError());

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
