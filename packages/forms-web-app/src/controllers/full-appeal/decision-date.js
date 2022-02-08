const { isValid, parseISO } = require('date-fns');
const { rules, validation } = require('@pins/business-rules');
const logger = require('../../lib/logger');

const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { DECISION_DATE: currentPage },
  },
} = require('../../lib/views');

const backLink = '/before-you-start/granted-or-refused';

exports.getDecisionDate = async (req, res) => {
  const { appeal } = req.session;

  const appealDecisionDate = parseISO(appeal.decisionDate);
  const decisionDate = isValid(appealDecisionDate) ? appealDecisionDate : null;

  res.render(currentPage, {
    decisionDate: decisionDate && {
      day: `0${decisionDate?.getDate()}`.slice(-2),
      month: `0${decisionDate?.getMonth() + 1}`.slice(-2),
      year: decisionDate?.getFullYear(),
    },
    backLink,
  });
};

exports.postDecisionDate = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  if (Object.keys(errors).length > 0) {
    return res.render(currentPage, {
      decisionDate: {
        day: body['decision-date-day'],
        month: body['decision-date-month'],
        year: body['decision-date-year'],
      },
      errors,
      errorSummary,
      backLink: `/before-you-start/granted-or-refused`,
    });
  }

  const enteredDate = new Date(
    body['decision-date-year'],
    (parseInt(body['decision-date-month'], 10) - 1).toString(),
    body['decision-date-day']
  );

  const isWithinExpiryPeriod = validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
    enteredDate,
    appeal.appealType,
    appeal.eligibility.applicationDecision
  );

  if (!isWithinExpiryPeriod) {
    const deadlineDate = rules.appeal.deadlineDate(
      enteredDate,
      appeal.appealType,
      appeal.eligibility.applicationDecision
    );
    const { time, duration } = rules.appeal.deadlinePeriod(
      appeal.appealType,
      appeal.eligibility.applicationDecision
    );
    req.session.appeal.eligibility.appealDeadline = deadlineDate;
    req.session.appeal.eligibility.appealPeriod = `${time} ${duration}`;

    return res.redirect(`/before-you-start/you-cannot-appeal`);
  }

  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      decisionDate: enteredDate.toISOString(),
    });
    return res.redirect(`/before-you-start/enforcement-notice`);
  } catch (e) {
    logger.error(e);

    return res.render(currentPage, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: 'decision-date' }],
      backLink: `/before-you-start/granted-or-refused`,
    });
  }
};
