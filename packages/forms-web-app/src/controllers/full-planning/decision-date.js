const { add, isBefore } = require('date-fns');
const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');

exports.getDecisionDate = async (req, res) => {
  res.render(VIEW.FULL_PLANNING.DECISION_DATE, {
    backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
  });
};

exports.postDecisionDate = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.FULL_PLANNING.DECISION_DATE, {
      decisionDate: {
        day: body['decision-date-day'],
        month: body['decision-date-month'],
        year: body['decision-date-year'],
      },
      errors,
      errorSummary,
      backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
    });
  }

  const todaysDate = Date.now();
  const enteredDate = new Date(
    body['decision-date-year'],
    (parseInt(body['decision-date-month'], 10) - 1).toString(),
    body['decision-date-day']
  );

  if (isBefore(enteredDate, add(new Date(todaysDate), { months: -6 }))) {
    return res.redirect(`/${VIEW.FULL_PLANNING.YOU_CANNOT_APPEAL}`);
  }

  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      decisionDate: enteredDate.toISOString(),
    });
    return res.redirect(`/${VIEW.FULL_PLANNING.ENFORCEMENT_NOTICE}`);
  } catch (e) {
    logger.error(e);

    res.render(VIEW.FULL_PLANNING.DECISION_DATE, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: 'decision-date' }],
      backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
    });
  }
};
