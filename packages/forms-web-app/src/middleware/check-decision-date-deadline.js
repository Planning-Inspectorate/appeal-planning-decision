const { rules, validation } = require('@pins/business-rules');
const { parseISO } = require('date-fns');
const { VIEW } = require('../lib/views');

const validationExclusionPages = [
  '/before-you-start/you-cannot-appeal',
  '/before-you-start/decision-date',
  '/before-you-start/date-decision-due',
  '/before-you-start/decision-date-householder',
  '/before-you-start/date-decision-due-householder',
  '/before-you-start/type-of-planning-application',
];
const youCannotAppealPage = '/before-you-start/you-cannot-appeal';

const setShutterPageProps = (req) => {
  const { appeal } = req.session;
  req.session.appeal.eligibility.appealDeadline =
    appeal.decisionDate &&
    rules.appeal.deadlineDate(
      new Date(appeal.decisionDate),
      appeal.appealType,
      appeal.eligibility.applicationDecision
    );

  const { duration, time } = rules.appeal.deadlinePeriod(
    appeal.appealType,
    appeal.eligibility.applicationDecision
  );
  req.session.appeal.eligibility.appealPeriod = `${time} ${duration}`;
};

const isWithinExpiryPeriod = (appeal) => {
  return validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
    new Date(appeal.decisionDate),
    appeal.appealType,
    appeal.eligibility?.applicationDecision
  );
};

const checkDecisionDateDeadline = (req, res, next) => {
  const { appeal } = req.session;

  if (appeal && appeal.decisionDate) {
    if (appeal.appealType && !validationExclusionPages.includes(req.originalUrl)) {
      if (!isWithinExpiryPeriod(appeal)) {
        setShutterPageProps(req);
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
