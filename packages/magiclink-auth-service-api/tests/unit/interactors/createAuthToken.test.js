jest.mock('../../../src/util/jwt');
jest.mock('../../../src/util/dateUtil');

const createAuthToken = require('../../../src/interactors/createAuthToken');
const mockJWTUtil = require('../../../src/util/jwt');
const mockDateUtils = require('../../../src/util/dateUtil');

describe('interactors.createAuthToken', () => {
  it('should create a jwt token', () => {
    const tokenValidity = 4 * 60 * 60 * 1000;
    const userInformation = { email: 'mock@test.com', lpaCode: 'E1234' };
    mockJWTUtil.sign.mockReturnValue('mockJWT');
    mockDateUtils.addMillisToCurrentDate.mockReturnValue(new Date('2021-08-19T05:10:00.000Z'));

    const jwt = createAuthToken(userInformation, tokenValidity);

    expect(mockJWTUtil.sign).toHaveBeenCalledWith({
      userInformation,
      exp: 1629349800000,
    });
    expect(jwt).toEqual('mockJWT');
  });
});
