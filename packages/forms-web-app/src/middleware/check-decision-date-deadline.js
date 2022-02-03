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

const isWithinExpiryPeriod = (appeal) => {
  return validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
    new Date(appeal.decisionDate),
    appeal.appealType
  );
};

const checkDecisionDateDeadline = (req, res, next) => {
  const { appeal } = req.session;

  if (appeal && appeal.decisionDate) {
    if (appeal.appealType && !validationExclusionPages.includes(req.originalUrl)) {
      if (!isWithinExpiryPeriod(appeal)) {
        res.redirect(youCannotAppealPage);
        return;
      }
    }

    if (!appeal.appealType && !req.originalUrl.includes(VIEW.ELIGIBILITY.DECISION_DATE)) {
      if (!isWithinExpiryPeriod(appeal)) {
        res.redirect(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
        return;
      }
    }
  }

  next();
};

module.exports = checkDecisionDateDeadline;
