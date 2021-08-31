jest.mock('../../../src/lib/magiclink-api-wrapper');
const authenticationController = require('../../../src/controllers/authentication');
const mockMagicLinkAPIWrapper = require('../../../src/lib/magiclink-api-wrapper');
const { mockReq, mockRes } = require('../mocks');
const { VIEW } = require('../../../src/lib/views');

const mockEmail = 'test.address@planninginspectorate.gov.uk';

describe('authentication controller', () => {
  let res;
  let req;

  beforeEach(() => {
    res = mockRes();
    req = mockReq();
    req.params.lpaCode = 'E69999999';
    req.lpa = {
      id: 'E69999999',
      name: 'System Test Borough Council',
      domain: 'planninginspectorate.gov.uk',
    };
  });

  describe('GET /:lpaCode/authentication/your-email', () => {
    it('should call the correct template', () => {
      authenticationController.showEnterEmailAddress(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: false,
        isLinkedExpired: false,
        lpaName: 'System Test Borough Council',
        enterEmailLink: '/E69999999/authentication/your-email',
      });
    });
  });

  describe('GET /:lpaCode/authentication/your-email/session-expired', () => {
    it('should call the correct template and the "isSessionExpired" attribute set true', () => {
      req.params.error = 'session-expired';

      authenticationController.showEnterEmailAddress(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: true,
        isLinkedExpired: false,
        lpaName: 'System Test Borough Council',
        enterEmailLink: '/E69999999/authentication/your-email',
      });
    });
  });

  describe('GET /:lpaCode/authentication/your-email/link-expired', () => {
    it('should call the correct template and the attribute "isLinkedExpired" set true', () => {
      req.params.error = 'link-expired';

      authenticationController.showEnterEmailAddress(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: false,
        isLinkedExpired: true,
        lpaName: 'System Test Borough Council',
        enterEmailLink: '/E69999999/authentication/your-email',
      });
    });
  });

  describe('POST /:lpaCode/authentication/your-email', () => {
    it('should call magic link API and redirect user to confirm email page if user email address is within lpa domain', async () => {
      req.body = { email: mockEmail };
      mockMagicLinkAPIWrapper.createMagicLink.mockResolvedValue();

      await authenticationController.processEmailAddress(req, res);

      expect(mockMagicLinkAPIWrapper.createMagicLink).toHaveBeenCalledTimes(1);
      expect(req.session.email).toEqual(mockEmail);
      expect(res.redirect).toHaveBeenCalledWith('/E69999999/authentication/confirm-email');
    });

    it('should redirect to confirm email page if user email address not within lpa domain', async () => {
      req.body = { email: 'test.address@test.co.uk' };
      mockMagicLinkAPIWrapper.createMagicLink.mockResolvedValue();

      await authenticationController.processEmailAddress(req, res);

      expect(mockMagicLinkAPIWrapper.createMagicLink).toHaveBeenCalledTimes(0);
      expect(req.session.email).toEqual('test.address@test.co.uk');
      expect(res.redirect).toHaveBeenCalledWith('/E69999999/authentication/confirm-email');
    });
  });

  describe('GET /:lpaCode/authentication/confirm-email', () => {
    it('should call the correct template', () => {
      req.session = {
        email: mockEmail,
      };
      authenticationController.showEmailConfirmation(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.EMAIL_ADDRESS_CONFIRMATION, {
        email: mockEmail,
        enterEmailLink: `/E69999999/authentication/your-email`,
      });
    });
  });
});
