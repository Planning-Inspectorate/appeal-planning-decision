const { subYears } = require('date-fns');
const { mockReq, mockRes } = require('../mocks');
const checkDecisionDateDeadline = require('../../../src/middleware/check-decision-date-deadline');
const { VIEW } = require('../../../src/lib/views');

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
      originalUrl: `/${VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION}`,
    };
  });

  it('should redirect the user to the decision date passed page if the decision date is outside the expiry period and the decision date page is not being rendered', () => {
    req.session.appeal.decisionDate = subYears(new Date(), 1);

    checkDecisionDateDeadline(req, res, next);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
  });

  it('should continue if the decision date is outside the expiry period and the decision date page is being rendered', () => {
    req.session.appeal.decisionDate = subYears(new Date(), 1);
    req.originalUrl = `/${VIEW.ELIGIBILITY.DECISION_DATE}`;

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
