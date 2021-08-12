jest.mock('passport');
const passport = require('passport');
const passportWrapper = require('../../../src/auth/passportWrapper');
const ExpiredJWTError = require('../../../src/auth/error/ExpiredJWTError');
const InvalidJWTError = require('../../../src/auth/error/InvalidJWTError');
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

  describe('with valid jwtPayload', () => {
    it('should resolve promise with jwtPayload value', async () => {
      mockPassportAuthenticateResponse(null, jwtPayload);

      const response = await passportWrapper.authenticate(strategyName, req, res);

      expect(response).toEqual(jwtPayload);
    });
  });

  describe('with expired jwtPayload', () => {
    it('should reject promise with ExpiredJWTError', async () => {
      jwtPayload.exp = '123';
      mockPassportAuthenticateResponse(null, jwtPayload);

      try {
        await passportWrapper.authenticate(strategyName, req, res);
      } catch (err) {
        expect(err.name).toEqual(ExpiredJWTError.name);
        expect(err.jwtPayload).toEqual(jwtPayload);
      }
    });
  });

  describe('with missing or invalid jwtPayload', () => {
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
