const { addWeeks, endOfDay, isBefore, isValid, parse } = require('date-fns');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { VIEW } = require('../../lib/views');
const config = require('../../config');

const getDeadlineDate = (decisionDate) => {
  const date = parse(decisionDate, 'yyyy-MM-dd', new Date());
  return addWeeks(endOfDay(date), 12);
};

exports.getNoDecision = (req, res) => {
  res.render(VIEW.ELIGIBILITY.NO_DECISION);
};

exports.getDecisionDate = (req, res) => {
  const { appeal } = req.session;

  const appealDecisionDate = parse(appeal.decisionDate, 'yyyy-MM-dd', new Date());
  const decisionDate = isValid(appealDecisionDate) ? appealDecisionDate : null;

  res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
    decisionDate,
  });
};

exports.postDecisionDate = async (req, res) => {
  const { body } = req;
  /* istanbul ignore next */
  const { appeal } = req.session;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    const decisionDate = parse(appeal.decisionDate, 'yyyy-MM-dd', new Date());

    res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
      decisionDate,
      errors,
      errorSummary,
    });
    return;
  }

  const decisionDate = body['decision-date-full'];

  appeal.decisionDate = decisionDate;

  try {
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);

    res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  const today = endOfDay(new Date());

  const decisionDatePassed = isBefore(getDeadlineDate(decisionDate), today);

  let redirectTo = decisionDatePassed
    ? `/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`
    : `/${VIEW.ELIGIBILITY.PLANNING_DEPARTMENT}`;

  if (config.server.limitedRouting.enabled && !decisionDatePassed) {
    redirectTo = config.server.limitedRouting.serviceUrl;
  }

  res.redirect(redirectTo);
};

exports.getDecisionDatePassed = (req, res) => {
  const { appeal } = req.session;

  const decisionDate = parse(appeal.decisionDate, 'yyyy-MM-dd', new Date());
  const deadlineDate = isValid(decisionDate) ? getDeadlineDate(appeal.decisionDate) : null;

  res.render(VIEW.ELIGIBILITY.DECISION_DATE_PASSED, {
    deadlineDate,
  });
};
