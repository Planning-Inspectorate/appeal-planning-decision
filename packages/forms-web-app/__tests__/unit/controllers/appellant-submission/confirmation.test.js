const confirmationController = require('../../../../src/controllers/appellant-submission/confirmation');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');

describe('controllers/appellant-submission/confirmation', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('getConfirmation', () => {
    let appealId;
    let appellantEmail;

    beforeEach(() => {
      appealId = 'some-fake-id';
      appellantEmail = 'hello@example.com';

      req = {
        ...req,
        session: {
          ...req.session,
          appeal: {
            id: appealId,
            'appellant-email': appellantEmail,
          },
        },
      };
    });

    it('should ensure req.session.appeal is reset', () => {
      expect(req.session.appeal).not.toBeNull();

      confirmationController.getConfirmation(req, res);

      expect(req.session.appeal).toBeNull();
    });

    it('should call the correct template', () => {
      confirmationController.getConfirmation(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.CONFIRMATION, {
        appellantEmail,
        appealId,
      });
    });
  });
});
