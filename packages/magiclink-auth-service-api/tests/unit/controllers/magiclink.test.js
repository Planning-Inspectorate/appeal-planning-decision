jest.mock('../../../src/interactors/createMagicLink');
jest.mock('../../../src/interactors/sendMagicLinkEmail');
jest.mock('../../../src/interactors/createAuthToken');
jest.mock('../../../src/util/dateUtil');

const magiclinkController = require('../../../src/controllers/magiclink');
const mockCreateMagicLinkInteractor = require('../../../src/interactors/createMagicLink');
const mockSendMagicLinkEmailInteractor = require('../../../src/interactors/sendMagicLinkEmail');
const mockCreateAuthTokenInteractor = require('../../../src/interactors/createAuthToken');
const mockDateUtils = require('../../../src/util/dateUtil');
const { mockReq, mockRes } = require('../mocks');
const mockMagicLinkData = require('../../resources/magicLinkData.json');

const req = mockReq();
const res = mockRes();

describe('controllers.magiclink', () => {
  describe('create', () => {
    it('should create a magic link and return it on the response', async () => {
      req.get.mockReturnValue('localhost:3005');
      req.body = mockMagicLinkData;
      const mockMagicLink = 'http://localhost:3005/magiclink/JWT';
      mockCreateMagicLinkInteractor.mockReturnValue(mockMagicLink);

      await magiclinkController.create(req, res);

      expect(mockSendMagicLinkEmailInteractor).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ magicLink: mockMagicLink });
    });
  });

  describe('login', () => {
    it('should create and set a new JWT cookie', async () => {
      req.magicLinkData = mockMagicLinkData;
      const mockJWT = 'mockJWT';
      mockCreateAuthTokenInteractor.mockReturnValue(mockJWT);
      mockDateUtils.addMillisToCurrentDate.mockReturnValue('2021-08-19T14:19:40.406Z');

      await magiclinkController.login(req, res);

      expect(res.cookie).toHaveBeenCalledWith(mockMagicLinkData.auth.cookieName, mockJWT, {
        expires: '2021-08-19T14:19:40.406Z',
        httpOnly: true,
      });
      expect(res.redirect).toHaveBeenCalledWith(mockMagicLinkData.magicLink.redirectURL);
    });
  });
});
