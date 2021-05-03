const { addWeeks, endOfDay, isBefore, isValid, parseISO } = require('date-fns');
const { createdOrUpdatedAppealHandler } = require('../../lib/create-or-update-appeal-handler');
const { VIEW } = require('../../lib/views');
const config = require('../../config');

const getDeadlineDate = (decisionDate) => {
  return addWeeks(endOfDay(decisionDate), 12);
};

exports.getNoDecision = (req, res) => {
  res.render(VIEW.ELIGIBILITY.NO_DECISION);
};

exports.getDecisionDate = (req, res) => {
  const { appeal } = req.session;

  const appealDecisionDate = parseISO(appeal.decisionDate);
  const decisionDate = isValid(appealDecisionDate) ? appealDecisionDate : null;

  res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
    decisionDate: decisionDate && {
      day: `0${decisionDate.getDate()}`.slice(-2),
      month: `0${decisionDate.getMonth() + 1}`.slice(-2),
      year: decisionDate.getFullYear(),
    },
  });
};

exports.postDecisionDate = async (req, res) => {
  const { body } = req;
  /* istanbul ignore next */
  const { appeal } = req.session;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
      decisionDate: {
        day: body['decision-date-day'],
        month: body['decision-date-month'],
        year: body['decision-date-year'],
      },
      errors,
      errorSummary,
    });
    return;
  }

  const decisionDate = body['decision-date'];
  appeal.decisionDate = `${decisionDate}T12:00:00.000Z`;

  const createOrUpdateAppealErrHandler = (e) => {
    res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
      errors,
      appeal: req.session.appeal,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
  };

  if (!(await createdOrUpdatedAppealHandler({ req, res, createOrUpdateAppealErrHandler }))) {
    return;
  }

  const today = endOfDay(new Date());
  const decisionDatePassed = isBefore(getDeadlineDate(parseISO(appeal.decisionDate)), today);

  let redirectTo = decisionDatePassed
    ? `/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`
    : `/${VIEW.ELIGIBILITY.PLANNING_DEPARTMENT}`;

  if (config.server.limitedRouting.enabled && !decisionDatePassed) {
    redirectTo = config.server.limitedRouting.serviceUrl;
  }

  res.redirect(redirectTo);
};

exports.getDecisionDatePassed = (req, res) => {
  const expiredDecisionDate = parseISO(req.session.expiredDecisionDate);
  const deadlineDate = isValid(expiredDecisionDate) ? getDeadlineDate(expiredDecisionDate) : null;

  res.render(VIEW.ELIGIBILITY.DECISION_DATE_PASSED, {
    deadlineDate,
  });
};
