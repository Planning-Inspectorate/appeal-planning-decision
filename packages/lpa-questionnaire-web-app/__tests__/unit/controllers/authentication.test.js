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

  describe('GET /appeal-questionnaire/:lpaCode/authentication/your-email', () => {
    it('should call the correct template', () => {
      req.session.redirectURL =
        'http://localhost:9001/appeal-questionnaire/89aa8504-773c-42be-bb68-029716ad9756/task-list';
      authenticationController.showEnterEmailAddress(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: false,
        isLinkedExpired: false,
        lpaName: 'System Test Borough Council',
        enterEmailLink: '/appeal-questionnaire/E69999999/authentication/your-email',
      });
    });
  });

  describe('GET /appeal-questionnaire/:lpaCode/authentication/your-email/session-expired', () => {
    it('should call the correct template and the "isSessionExpired" attribute set true', () => {
      req.session = null;
      req.params.error = 'session-expired';

      authenticationController.showEnterEmailAddress(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: true,
        isLinkedExpired: false,
        lpaName: 'System Test Borough Council',
        enterEmailLink: '/appeal-questionnaire/E69999999/authentication/your-email',
      });
    });
  });

  describe('GET /appeal-questionnaire/:lpaCode/authentication/your-email/link-expired', () => {
    it('should call the correct template and the attribute "isLinkedExpired" set true', () => {
      req.session = null;
      req.params.error = 'link-expired';

      authenticationController.showEnterEmailAddress(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: false,
        isLinkedExpired: true,
        lpaName: 'System Test Borough Council',
        enterEmailLink: '/appeal-questionnaire/E69999999/authentication/your-email',
      });
    });
  });

  describe('POST /appeal-questionnaire/:lpaCode/authentication/your-email', () => {
    it('should call magic link API and redirect user to confirm email page if user email address is within lpa domain', async () => {
      req.body = { email: mockEmail };
      mockMagicLinkAPIWrapper.createMagicLink.mockResolvedValue();

      await authenticationController.processEmailAddress(req, res);

      expect(mockMagicLinkAPIWrapper.createMagicLink).toHaveBeenCalledTimes(1);
      expect(req.session.email).toEqual(mockEmail);
      expect(res.redirect).toHaveBeenCalledWith(
        '/appeal-questionnaire/E69999999/authentication/confirm-email'
      );
    });

    it('should redirect to confirm email page if user email address not within lpa domain', async () => {
      req.body = { email: 'test.address@test.co.uk' };
      mockMagicLinkAPIWrapper.createMagicLink.mockResolvedValue();

      await authenticationController.processEmailAddress(req, res);

      expect(mockMagicLinkAPIWrapper.createMagicLink).toHaveBeenCalledTimes(0);
      expect(req.session.email).toEqual('test.address@test.co.uk');
      expect(res.redirect).toHaveBeenCalledWith(
        '/appeal-questionnaire/E69999999/authentication/confirm-email'
      );
    });

    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          isSessionExpired: false,
          isLinkedExpired: false,
          lpaName: 'System Test Borough Council',
          enterEmailLink: `/appeal-questionnaire/${req.params.lpaCode}/${VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS}`,
          email: null,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await authenticationController.processEmailAddress(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: false,
        isLinkedExpired: false,
        lpaName: 'System Test Borough Council',
        enterEmailLink: `/appeal-questionnaire/${req.params.lpaCode}/${VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS}`,
        email: null,
        errors: { a: 'b' },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
      });
    });
  });

  describe('GET /appeal-questionnaire/:lpaCode/authentication/confirm-email', () => {
    it('should call the correct template', () => {
      req.session = {
        email: mockEmail,
      };
      authenticationController.showEmailConfirmation(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.EMAIL_ADDRESS_CONFIRMATION, {
        email: mockEmail,
        enterEmailLink: `/appeal-questionnaire/E69999999/authentication/your-email`,
      });
    });
  });
});
