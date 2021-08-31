jest.mock('passport');
const passport = require('passport');
const passportWrapper = require('../../../../src/services/authentication/passportWrapper');
const ExpiredTokenError = require('../../../../src/services/authentication/error/ExpiredTokenError');
const InvalidTokenError = require('../../../../src/services/authentication/error/InvalidTokenError');
const { mockReq, mockRes } = require('../../mocks');

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
      userInformation: {},
    };
  });

  it('should resolve promise with tokenPayload value if tokenPayload is valid', async () => {
    mockPassportAuthenticateResponse(null, jwtPayload);

    const response = await passportWrapper.authenticate(strategyName, req, res);

    expect(response).toEqual(jwtPayload);
  });

  it('should reject promise with ExpiredTokenError if tokenPayload is expired', async () => {
    jwtPayload.exp = '123';
    mockPassportAuthenticateResponse(null, jwtPayload);

    try {
      await passportWrapper.authenticate(strategyName, req, res);
    } catch (err) {
      expect(err.name).toEqual(ExpiredTokenError.name);
      expect(err.tokenPayload).toEqual(jwtPayload);
    }
  });

  it('should reject promise with InvalidTokenError if tokenPayload is  missing or invalid ', async () => {
    mockPassportAuthenticateResponse(null, false);

    try {
      await passportWrapper.authenticate(strategyName, req, res);
    } catch (err) {
      expect(err.name).toEqual(InvalidTokenError.name);
    }
  });
});
