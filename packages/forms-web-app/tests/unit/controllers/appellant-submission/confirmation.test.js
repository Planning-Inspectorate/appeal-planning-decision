const confirmationController = require('../../../../src/controllers/appellant-submission/confirmation');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');

const req = mockReq();
const res = mockRes();

describe('controllers/appellant-submission/confirmation', () => {
  describe('getConfirmation', () => {
    it('should call the correct template', () => {
      const appellantEmail = 'hello@example.com';
      const r = {
        ...req,
        session: {
          ...req.session,
          appeal: {
            'appellant-email': appellantEmail,
          },
        },
      };
      confirmationController.getConfirmation(r, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.CONFIRMATION, {
        appellantEmail,
      });
    });
  });
});
