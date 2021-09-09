jest.mock('../../../src/interactors/createMagicLink');
jest.mock('../../../src/interactors/sendMagicLinkEmail');
jest.mock('../../../src/interactors/createAuthToken');
jest.mock('../../../src/util/dateUtil');

const magiclinkController = require('../../../src/controllers/magiclink');
const config = require('../../../src/config');

const mockCreateMagicLinkInteractor = require('../../../src/interactors/createMagicLink');
const mockSendMagicLinkEmailInteractor = require('../../../src/interactors/sendMagicLinkEmail');
const mockCreateAuthTokenInteractor = require('../../../src/interactors/createAuthToken');
const mockDateUtils = require('../../../src/util/dateUtil');
const { mockReq, mockRes } = require('../mocks');
const mockMagicLinkData = require('../../resources/magicLinkData.json');

const req = mockReq();
const res = mockRes();

describe('controllers.magiclink', () => {
  describe('initiateMagicLinkFlow', () => {
    let mockMagicLink;

    beforeEach(() => {
      const apiProtocol = 'http';
      const apiHost = 'localhost:3005';
      req.get.mockReturnValue(apiHost);
      req.protocol = apiProtocol;

      req.body = mockMagicLinkData;

      mockMagicLink = 'http://localhost:3005/magiclink/JWT';
      mockCreateMagicLinkInteractor.mockReturnValue(mockMagicLink);
    });

    it('should create a magic link, send it via email and return it on the response', async () => {
      await magiclinkController.initiateMagicLinkFlow(req, res);

      expect(mockSendMagicLinkEmailInteractor).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ magicLink: mockMagicLink });
    });

    it('should use the API host and protocol for the creation of magic link URL if config value `magicLinkURL` is undefined', async () => {
      await magiclinkController.initiateMagicLinkFlow(req, res);

      expect(mockCreateMagicLinkInteractor).toHaveBeenCalledWith(
        'http://localhost:3005',
        mockMagicLinkData,
      );
    });

    it('should use the magicLinkURL config value for the creation of magic link URL if config value `magicLinkURL` is defined', async () => {
      const magicLinkURL = 'https://testdomain:9001';
      config.magicLinkURL = magicLinkURL;

      await magiclinkController.initiateMagicLinkFlow(req, res);

      expect(mockCreateMagicLinkInteractor).toHaveBeenCalledWith(magicLinkURL, mockMagicLinkData);
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
