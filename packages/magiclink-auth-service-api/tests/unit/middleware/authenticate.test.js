jest.mock('../../../src/service/authenticationService');
jest.mock('../../../src/mappers/magicLinkTokenMapper');

const ExpiredTokenError = require('../../../src/service/error/ExpiredTokenError');
const InvalidTokenError = require('../../../src/service/error/InvalidTokenError');
const authenticationService = require('../../../src/service/authenticationService');
const magicLinkTokenMapper = require('../../../src/mappers/magicLinkTokenMapper');
const authenticate = require('../../../src/middleware/authenticate');

const magicLinkData = require('../../resources/magicLinkData.json');
const { mockReq, mockRes } = require('../mocks');

describe('middleware.authenticate', () => {
  let req;
  let res;

  const next = jest.fn();
  const tokenPayload = { exp: 12434, data: 'mockEncryptedData' };

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    magicLinkTokenMapper.tokenToMagicLinkData.mockReturnValue(magicLinkData);
  });

  describe('with expired jwtToken', () => {
    it('should redirect user to token payload attribute value "expiredLinkRedirectURL"', async () => {
      authenticationService.authenticate.mockRejectedValue(
        new ExpiredTokenError('', tokenPayload),
      );

      await authenticate(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(
        `${magicLinkData.magicLink.expiredLinkRedirectURL}?redirectURL=${encodeURIComponent(
          magicLinkData.magicLink.redirectURL,
        )}`,
      );
    });
  });

  describe('with valid jwtToken', () => {
    it('should set the decoded jwt user data on the request', async () => {
      authenticationService.authenticate.mockResolvedValue(tokenPayload);

      await authenticate(req, res, next);

      expect(req.magicLinkData).toEqual(magicLinkData);
    });
  });

  describe('with invalid token', () => {
    it('should redirect to error page', async () => {
      authenticationService.authenticate.mockRejectedValue(new InvalidTokenError());

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
