const { addWeeks, endOfDay, isBefore, isValid, parseISO } = require('date-fns');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
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
    decisionDate,
  });
};

exports.postDecisionDate = async (req, res) => {
  const { body } = req;
  /* istanbul ignore next */
  const { appeal } = req.session;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    const appealDecisionDate = parseISO(appeal.decisionDate);
    const decisionDate = isValid(appealDecisionDate) ? appealDecisionDate : null;

    res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
      decisionDate,
      errors,
      errorSummary,
    });
    return;
  }

  const decisionDate = body['decision-date'];

  appeal.decisionDate = `${decisionDate}T12:00:00.000Z`;

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
  const { appeal } = req.session;

  const decisionDate = parseISO(appeal.decisionDate);
  const deadlineDate = isValid(decisionDate) ? getDeadlineDate(decisionDate) : null;

  res.render(VIEW.ELIGIBILITY.DECISION_DATE_PASSED, {
    deadlineDate,
  });
};
