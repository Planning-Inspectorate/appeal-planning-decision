jest.mock('../../../src/lib/magiclink-api-wrapper');
const authenticationController = require('../../../src/controllers/authentication');
const magicLinkAPIWrapper = require(  '../../../src/lib/magiclink-api-wrapper');
const { mockReq, mockRes } = require('../mocks');
const mockAppeal = require('../mockAppeal');
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
      req.session.redirectURL = `http://localhost:9001/appeal-questionnaire/${mockAppeal.id}/task-list`;
      authenticationController.showEnterEmailAddress(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: false,
        isLinkExpired: false,
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
        isLinkExpired: false,
        lpaName: 'System Test Borough Council',
        enterEmailLink: '/appeal-questionnaire/E69999999/authentication/your-email',
      });
    });
  });

  describe('GET /appeal-questionnaire/:lpaCode/authentication/your-email/link-expired', () => {
    it('should call the correct template and the attribute "isLinkExpired" set true', () => {
      req.session = null;
      req.params.error = 'link-expired';

      authenticationController.showEnterEmailAddress(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AUTHENTICATION.ENTER_EMAIL_ADDRESS, {
        isSessionExpired: false,
        isLinkExpired: true,
        lpaName: 'System Test Borough Council',
        enterEmailLink: '/appeal-questionnaire/E69999999/authentication/your-email',
      });
    });
  });
});
