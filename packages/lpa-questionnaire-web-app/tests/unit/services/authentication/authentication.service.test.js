jest.mock('../../../../src/services/authentication/passportWrapper');
const authenticationService = require('../../../../src/services/authentication/authentication.service');
const passportWrapper = require('../../../../src/services/authentication/passportWrapper');
const { req, res } = require('../../mocks');

describe('service.authenticationService', () => {
  test('should set up the authentication strategy and call passportWrapper', () => {
    authenticationService.authenticate(req, res);
    expect(passportWrapper.authenticate).toHaveBeenCalledWith('JWT', req, res);
  });
});
