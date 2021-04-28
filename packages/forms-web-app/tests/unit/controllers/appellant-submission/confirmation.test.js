const { endOfDay, subWeeks } = require('date-fns');
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
    let decisionDate;
    const today = endOfDay(new Date());

    beforeEach(() => {
      decisionDate = (subWeeks(endOfDay(today), 1)).toISOString();

      appealId = 'some-fake-id';
      appellantEmail = 'hello@example.com';

      req = {
        ...req,
        session: {
          ...req.session,
          appeal: {
            decisionDate,
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
        appealId
      });
    });

    it('should call redirect to decision date passed', () => {
      req.session.appeal.decisionDate = (subWeeks(endOfDay(today), 13)).toISOString();

      confirmationController.getConfirmation(req, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
    });
  });
});
