const appealSubmittedController = require('../../../../../src/controllers/full-appeal/submit-appeal/appeal-submitted');
const { mockReq, mockRes } = require('../../../mocks');
const { VIEW } = require('../../../../../src/lib/full-appeal/views');

describe('controllers/full-appeal/submit-appeal/appeal-submitted', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('getAppealSubmitted', () => {
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

      appealSubmittedController.getAppealSubmitted(req, res);

      expect(req.session.appeal).toBeNull();
    });

    it('should call the correct template', () => {
      appealSubmittedController.getAppealSubmitted(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.APPEAL_SUBMITTED, {
        appellantEmail,
        appealId,
      });
    });
  });
});
