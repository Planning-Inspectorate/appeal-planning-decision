jest.mock('../../../src/interactors/createMagicLink');
jest.mock('../../../src/interactors/sendMagicLinkEmail');
jest.mock('../../../src/interactors/createAuthToken');
jest.mock('../../../src/util/dateUtil');

const magiclinkController = require('../../../src/controllers/magiclink');
const config = require('../../../src/config');

const createMagicLinkInteractor = require('../../../src/interactors/createMagicLink');
const sendMagicLinkEmailInteractor = require('../../../src/interactors/sendMagicLinkEmail');
const createAuthTokenInteractor = require('../../../src/interactors/createAuthToken');
const dateUtils = require('../../../src/util/dateUtil');
const { mockReq, mockRes } = require('../mocks');
const magicLinkData = require('../../resources/magicLinkData.json');

const req = mockReq();
const res = mockRes();

describe('controllers.magiclink', () => {
  describe('initiateMagicLinkFlow', () => {
    let magicLink;

    beforeEach(() => {
      const apiProtocol = 'http';
      const apiHost = 'localhost:3005';
      req.get.mockReturnValue(apiHost);
      req.protocol = apiProtocol;

      req.body = magicLinkData;

      magicLink = 'http://localhost:3005/magiclink/JWT';
      createMagicLinkInteractor.mockReturnValue(magicLink);
    });

    it('should create a magic link, send it via email and return it on the response', async () => {
      await magiclinkController.initiateMagicLinkFlow(req, res);

      expect(sendMagicLinkEmailInteractor).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ magicLink });
    });

    it('should use the API host and protocol for the creation of magic link URL if config value `magicLinkURL` is undefined', async () => {
      await magiclinkController.initiateMagicLinkFlow(req, res);

      expect(createMagicLinkInteractor).toHaveBeenCalledWith(
        'http://localhost:3005',
        magicLinkData,
      );
    });

    it('should use the magicLinkURL config value for the creation of magic link URL if config value `magicLinkURL` is defined', async () => {
      const magicLinkURL = 'https://testdomain:9001';
      config.magicLinkURL = magicLinkURL;

      await magiclinkController.initiateMagicLinkFlow(req, res);

      expect(createMagicLinkInteractor).toHaveBeenCalledWith(magicLinkURL, magicLinkData);
    });
  });

  describe('login', () => {
    it('should create and set a new JWT cookie', async () => {
      req.magicLinkData = magicLinkData;
      const jwt = 'jwt';
      createAuthTokenInteractor.mockReturnValue(jwt);
      dateUtils.addMillisToCurrentDate.mockReturnValue('2021-08-19T14:19:40.406Z');

      await magiclinkController.login(req, res);

      expect(res.cookie).toHaveBeenCalledWith(magicLinkData.auth.cookieName, jwt, {
        expires: '2021-08-19T14:19:40.406Z',
        httpOnly: true,
      });
      expect(res.redirect).toHaveBeenCalledWith(magicLinkData.magicLink.redirectURL);
    });
  });
});
