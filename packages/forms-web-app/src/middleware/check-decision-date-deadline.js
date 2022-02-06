const { validation } = require('@pins/business-rules');
const { VIEW } = require('../lib/views');

const validationExclusionPages = [
  '/before-you-start/you-cannot-appeal',
  '/before-you-start/decision-date',
  '/before-you-start/date-decision-due',
  '/before-you-start/decision-date-householder',
  '/before-you-start/date-decision-due-householder',
];
const youCannotAppealPage = '/before-you-start/you-cannot-appeal';

const checkDecisionDateDeadline = (req, res, next) => {
  const { appeal } = req.session;

  if (appeal && appeal.decisionDate) {
    if (appeal.appealType && !validationExclusionPages.includes(req.originalUrl)) {
      const isWithinExpiryPeriod = validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
        new Date(appeal.decisionDate),
        appeal.appealType,
        appeal.eligibility.applicationDecision
      );

      if (!isWithinExpiryPeriod) {
        res.redirect(youCannotAppealPage);
        return;
      }
    }

    if (!appeal.appealType && !req.originalUrl.includes(VIEW.ELIGIBILITY.DECISION_DATE)) {
      const isWithinExpiryPeriod = validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
        new Date(appeal.decisionDate)
      );

      if (!isWithinExpiryPeriod) {
        res.redirect(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
        return;
      }
    }
  }

  next();
};

module.exports = checkDecisionDateDeadline;
