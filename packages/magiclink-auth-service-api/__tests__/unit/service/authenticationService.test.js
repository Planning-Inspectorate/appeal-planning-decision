jest.mock('../../../src/service/passportWrapper');
const authenticationService = require('../../../src/service/authenticationService');
const passportWrapper = require('../../../src/service/passportWrapper');
const { req, res } = require('../mocks');

describe('service.authenticationService', () => {
  test('should set up the authentication strategy and call passportWrapper', () => {
    authenticationService.authenticate(req, res);
    expect(passportWrapper.authenticate).toHaveBeenCalledWith('JWT', req, res);
  });
});
