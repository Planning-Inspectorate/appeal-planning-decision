jest.mock('passport');
const passport = require('passport');
const passportWrapper = require('../../../src/services/authentication/passportWrapper');
const ExpiredJWTError = require('../../../src/services/authentication/error/ExpiredTokenError');
const InvalidJWTError = require('../../../src/services/authentication/error/InvalidTokenError');
const { mockReq, mockRes } = require('../mocks');

function mockPassportAuthenticateResponse(error, response) {
  passport.authenticate = jest.fn((authType, callback) => () => {
    callback(error, response);
  });
}

describe('passportWrapper.authenticate', () => {
  const strategyName = 'testJWT';
  const req = mockReq();
  const res = mockRes();

  let tokenPayload;

  beforeEach(() => {
    tokenPayload = {
      exp: 1912235086000,
      userData: {},
    };
  });

  describe('with valid tokenPayload', () => {
    it('should resolve promise with tokenPayload value', async () => {
      mockPassportAuthenticateResponse(null, tokenPayload);

      const response = await passportWrapper.authenticate(strategyName, req, res);

      expect(response).toEqual(tokenPayload);
    });
  });

  describe('with expired tokenPayload', () => {
    it('should reject promise with ExpiredJWTError', async () => {
      tokenPayload.exp = '123';
      mockPassportAuthenticateResponse(null, tokenPayload);

      try {
        await passportWrapper.authenticate(strategyName, req, res);
      } catch (err) {
        expect(err.name).toEqual(ExpiredJWTError.name);
        expect(err.tokenPayload).toEqual(tokenPayload);
      }
    });
  });

  describe('with missing or invalid tokenPayload', () => {
    it('should reject promise with InvalidJWTError', async () => {
      mockPassportAuthenticateResponse(null, false);

      try {
        await passportWrapper.authenticate(strategyName, req, res);
      } catch (err) {
        expect(err.name).toEqual(InvalidJWTError.name);
      }
    });
  });
});