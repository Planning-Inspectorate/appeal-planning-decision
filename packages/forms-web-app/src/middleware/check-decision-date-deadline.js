const { validation } = require('@pins/business-rules');
const { VIEW } = require('../lib/views');

const checkDecisionDateDeadline = (req, res, next) => {
  const { appeal } = req.session;

  if (appeal && appeal.decisionDate && !req.originalUrl.includes(VIEW.ELIGIBILITY.DECISION_DATE)) {
    const isWithinExpiryPeriod = validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
      new Date(appeal.decisionDate)
    );

    if (!isWithinExpiryPeriod) {
      res.redirect(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
      return;
    }
  }

  next();
};

module.exports = checkDecisionDateDeadline;
