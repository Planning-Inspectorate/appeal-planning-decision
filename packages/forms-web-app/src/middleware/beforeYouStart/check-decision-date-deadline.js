const { validation } = require('@pins/business-rules');

const validationExclusionPages=[
  '/before-you-start/you-cannot-appeal',
  '/before-you-start/decision-date',
  '/before-you-start/date-decision-due',
  '/before-you-start/decision-date-householder', 
  '/before-you-start/date-decision-due-householder'
];

const checkDecisionDateDeadline = (req, res, next) => {
  const { appeal } = req.session;
  const youCannotAppealPage = '/before-you-start/you-cannot-appeal';

  if (appeal && appeal.appealType && appeal.decisionDate && !validationExclusionPages.includes(req.originalUrl)) {
    const isWithinExpiryPeriod = validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
      new Date(appeal.decisionDate),
      appeal.appealType
    );

    if (!isWithinExpiryPeriod) {
      res.redirect(youCannotAppealPage);
      return;
    }
  }

  next();
};

module.exports = checkDecisionDateDeadline;
