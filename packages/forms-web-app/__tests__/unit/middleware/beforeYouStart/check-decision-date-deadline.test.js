const {
  constants: {
    APPEAL_ID: { HOUSEHOLDER, PLANNING_SECTION_78: FULL_APPEAL },
  },
} = require('@pins/business-rules');
const { subYears, subMonths } = require('date-fns');
const { mockReq, mockRes } = require('../../mocks');
const checkDecisionDateDeadline = require('../../../../src/middleware/beforeYouStart/check-decision-date-deadline');

describe('middleware/check-decision-date-deadline', () => {
  let req;
  const res = mockRes();
  const next = jest.fn();

  beforeEach(() => {
    req = {
      ...mockReq,
      session: {
        appeal: {},
      },
    };
  });

  it('should redirect the user to the you cannot appeal page if the decision date is outside the expiry period for full appeal and the decision date page is not being rendered', () => {
    req.session.appeal.appealType = FULL_APPEAL;
    req.session.appeal.decisionDate = subYears(new Date(), 1);

    checkDecisionDateDeadline(req, res, next);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/before-you-start/you-cannot-appeal');
  });

  it('should redirect the user to the you cannot appeal page if the decision date is outside the expiry period for Householder and the decision date page is not being rendered', () => {
    req.session.appeal.appealType = HOUSEHOLDER;
    req.session.appeal.decisionDate = subYears(new Date(), 1);

    checkDecisionDateDeadline(req, res, next);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/before-you-start/you-cannot-appeal');
  });

  it('should continue if the decision date is inside the expiry period and the decision date page is being rendered', () => {
    req.session.appeal.decisionDate = subMonths(new Date(), 1);

    checkDecisionDateDeadline(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should continue if there is no appeal data', () => {
    delete req.session.appeal;

    checkDecisionDateDeadline(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should continue if the appeal data is null', () => {
    req.session.appeal = null;

    checkDecisionDateDeadline(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should continue if there is no appeal type', () => {
    delete req.session.appeal.appealType;

    checkDecisionDateDeadline(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should continue if the appeal type is null', () => {
    req.session.appeal.appealType = null;

    checkDecisionDateDeadline(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should continue if the decision date is null', () => {
    req.session.appeal.decisionDate = null;

    checkDecisionDateDeadline(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should continue if the decision date is inside the expiry period', () => {
    req.session.appeal.decisionDate = new Date();

    checkDecisionDateDeadline(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
