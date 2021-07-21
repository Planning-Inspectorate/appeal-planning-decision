const authenticationController = require('../../../src/controllers/authentication');
const { mockReq, mockRes } = require('../mocks');
const { VIEW } = require('../../../src/lib/views');

const mockEmail = 'test.email@test.uk';
const mockAppealId = '123';

const res = mockRes();
const req = mockReq({}, mockAppealId);

describe('controllers /authentication/your-email', () => {
  describe('show authentication enter email page', () => {
    it('should call the correct template', () => {
      authenticationController.showEnterEmailAddress(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: false,
        isLinkedExpired: false,
        lpaName: 'testLPA',
        enterEmailLink: '/123/authentication/your-email',
      });
    });
  });
});

describe('controllers /authentication/your-email/session-expired', () => {
  describe('show authentication enter email page with session expired notification ', () => {
    it('should call the correct template', () => {
      const sessionExpiredReq = {
        ...req,
      };
      sessionExpiredReq.params.error = 'session-expired';

      authenticationController.showEnterEmailAddress(sessionExpiredReq, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: true,
        isLinkedExpired: false,
        lpaName: 'testLPA',
        enterEmailLink: '/123/authentication/your-email',
      });
    });
  });
});

describe('controllers /authentication/your-email/link-expired', () => {
  describe('show authentication enter email page with link expired notification ', () => {
    it('should call the correct template', () => {
      const linkExpiredReq = {
        ...req,
      };
      linkExpiredReq.params.error = 'link-expired';

      authenticationController.showEnterEmailAddress(linkExpiredReq, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: false,
        isLinkedExpired: true,
        lpaName: 'testLPA',
        enterEmailLink: '/123/authentication/your-email',
      });
    });
  });
});

describe('controllers /authentication/your-email', () => {
  describe('processes email authentication', () => {
    it('should call the correct template', () => {
      authenticationController.processEmailAddress(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/123/authentication/confirm-email');
    });
  });
});

describe('controllers /authentication/confirm-email', () => {
  describe('show authentication email confirmation page', () => {
    it('should call the correct template', () => {
      const confirmEmailReq = {
        ...req,
        session: {
          email: mockEmail,
        },
      };
      authenticationController.showEmailConfirmation(confirmEmailReq, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.EMAIL_ADDRESS_CONFIRMATION, {
        email: mockEmail,
        tokenExpirationTime: '15 minutes',
        enterEmailLink: `/123/authentication/your-email`,
      });
    });
  });
});
