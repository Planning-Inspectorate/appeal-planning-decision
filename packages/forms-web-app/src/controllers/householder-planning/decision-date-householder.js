const { add, isBefore } = require('date-fns');
const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');

exports.getDecisionDateHouseholder = async (req, res) => {
  res.render(VIEW.HOUSEHOLDER_PLANNING.DECISION_DATE_HOUSEHOLDER, {
    backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
  });
};

exports.postDecisionDateHouseholder = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.HOUSEHOLDER_PLANNING.DECISION_DATE_HOUSEHOLDER, {
      decisionDateHouseholder: {
        day: body['decision-date-householder-day'],
        month: body['decision-date-householder-month'],
        year: body['decision-date-householder-year'],
      },
      errors,
      errorSummary,
      backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
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
    appeal.applicationDecision === 'GRANTED' &&
    isBefore(enteredDate, add(new Date(todaysDate), { months: -6 }))
  ) {
    return res.redirect(`/${VIEW.FULL_PLANNING.YOU_CANNOT_APPEAL}`);
  }

  if (
    appeal.applicationDecision === 'REFUSED' &&
    isBefore(enteredDate, add(new Date(todaysDate), { weeks: -12 }))
  ) {
    return res.redirect(`/${VIEW.FULL_PLANNING.YOU_CANNOT_APPEAL}`);
  }

  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      decisionDateHouseholder: enteredDate.toISOString(),
    });
    return res.redirect(`/${VIEW.FULL_PLANNING.ENFORCEMENT_NOTICE}`);
  } catch (e) {
    logger.error(e);

    return res.render(VIEW.HOUSEHOLDER_PLANNING.DECISION_DATE_HOUSEHOLDER, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: 'decision-date-householder' }],
      backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
    });
  }
};
