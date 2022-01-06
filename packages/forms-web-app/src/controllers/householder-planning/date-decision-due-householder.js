const { add, isBefore } = require('date-fns');
const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');

exports.getDateDecisionDueHouseholder = async (req, res) => {
  res.render(VIEW.HOUSEHOLDER_PLANNING.DATE_DECISION_DUE_HOUSEHOLDER, {
    backLink: `/${VIEW.HOUSEHOLDER_PLANNING.GRANTED_OR_REFUSED}`,
  });
};

exports.postDateDecisionDueHouseholder = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.HOUSEHOLDER_PLANNING.DATE_DECISION_DUE_HOUSEHOLDER, {
      decisionDate: {
        day: body['date-decision-due-householder-day'],
        month: body['date-decision-due-householder-month'],
        year: body['date-decision-due-householder-year'],
      },
      errors,
      errorSummary,
      backLink: `${VIEW.HOUSEHOLDER_PLANNING.GRANTED_OR_REFUSED}`,
    });
  }

  const todaysDate = Date.now();
  const enteredDate = new Date(
    body['date-decision-due-householder-year'],
    (parseInt(body['date-decision-due-householder-month'], 10) - 1).toString(),
    body['date-decision-due-householder-day']
  );

  if (isBefore(enteredDate, add(new Date(todaysDate), { months: -6 }))) {
    return res.redirect(`/${VIEW.FULL_APPEAL.YOU_CANNOT_APPEAL}`);
  }

  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      decisionDate: enteredDate.toISOString(),
    });
    return res.redirect(`/${VIEW.FULL_APPEAL.ENFORCEMENT_NOTICE}`);
  } catch (e) {
    logger.error(e);

    return res.render(VIEW.HOUSEHOLDER_PLANNING.DATE_DECISION_DUE_HOUSEHOLDER, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: 'date-decision-due-householder' }],
      backLink: `${VIEW.HOUSEHOLDER_PLANNING.GRANTED_OR_REFUSED}`,
    });
  }
};
