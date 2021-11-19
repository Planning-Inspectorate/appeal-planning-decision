jest.mock('passport');
const passport = require('passport');
const passportWrapper = require('../../../src/service/passportWrapper');
const ExpiredTokenError = require('../../../src/service/error/ExpiredTokenError');
const InvalidTokenError = require('../../../src/service/error/InvalidTokenError');
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

  let jwtPayload;

  beforeEach(() => {
    jwtPayload = {
      exp: 1912235086000,
      userData: {},
    };
  });

  describe('with valid tokenPayload', () => {
    it('should resolve promise with tokenPayload value', async () => {
      mockPassportAuthenticateResponse(null, jwtPayload);

      const response = await passportWrapper.authenticate(strategyName, req, res);

      expect(response).toEqual(jwtPayload);
    });
  });

  describe('with expired tokenPayload', () => {
    it('should reject promise with ExpiredJWTError', async () => {
      jwtPayload.exp = '123';
      mockPassportAuthenticateResponse(null, jwtPayload);

      try {
        await passportWrapper.authenticate(strategyName, req, res);
      } catch (err) {
        expect(err.name).toEqual(ExpiredTokenError.name);
        expect(err.tokenPayload).toEqual(jwtPayload);
      }
    });
  });

  describe('with missing or invalid tokenPayload', () => {
    it('should reject promise with InvalidJWTError', async () => {
      mockPassportAuthenticateResponse(null, false);

      try {
        await passportWrapper.authenticate(strategyName, req, res);
      } catch (err) {
        expect(err.name).toEqual(InvalidTokenError.name);
      }
    });
  });
});
