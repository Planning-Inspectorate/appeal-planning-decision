const { add, isBefore } = require('date-fns');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { VIEW } = require('../../../lib/householder-planning/views');
const { VIEW: FULL_APPEAL_VIEW } = require('../../../lib/views');

exports.getDecisionDateHouseholder = async (req, res) => {
  res.render(VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DECISION_DATE_HOUSEHOLDER, {
    backLink: `${FULL_APPEAL_VIEW.FULL_APPEAL.GRANTED_OR_REFUSED}`,
  });
};

exports.postDecisionDateHouseholder = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DECISION_DATE_HOUSEHOLDER, {
      decisionDateHouseholder: {
        day: body['decision-date-householder-day'],
        month: body['decision-date-householder-month'],
        year: body['decision-date-householder-year'],
      },
      errors,
      errorSummary,
      backLink: `${FULL_APPEAL_VIEW.FULL_APPEAL.GRANTED_OR_REFUSED}`,
    });
  }

  const todaysDate = Date.now();
  const enteredDate = new Date(
    body['decision-date-householder-year'],
    (parseInt(body['decision-date-householder-month'], 10) - 1).toString(),
    body['decision-date-householder-day']
  );

  // make tech debt ticket for enforcing ordering

  if (
    appeal.eligibility.applicationDecision === 'granted' &&
    isBefore(enteredDate, add(new Date(todaysDate), { months: -6 }))
  ) {
    return res.redirect(`/${FULL_APPEAL_VIEW.FULL_APPEAL.YOU_CANNOT_APPEAL}`);
  }

  if (
    appeal.eligibility.applicationDecision === 'refused' &&
    isBefore(enteredDate, add(new Date(todaysDate), { weeks: -12 }))
  ) {
    return res.redirect(`/${FULL_APPEAL_VIEW.FULL_APPEAL.YOU_CANNOT_APPEAL}`);
  }

  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      decisionDateHouseholder: enteredDate.toISOString(),
    });
    return res.redirect(`/${FULL_APPEAL_VIEW.FULL_APPEAL.ENFORCEMENT_NOTICE}`);
  } catch (e) {
    logger.error(e);

    return res.render(VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DECISION_DATE_HOUSEHOLDER, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: 'decision-date-householder' }],
      backLink: `${FULL_APPEAL_VIEW.FULL_APPEAL.GRANTED_OR_REFUSED}`,
    });
  }
};
