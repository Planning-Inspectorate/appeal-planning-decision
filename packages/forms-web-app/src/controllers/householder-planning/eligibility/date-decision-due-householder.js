const { add, isBefore } = require('date-fns');
const { rules, constants } = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { VIEW } = require('../../../lib/householder-planning/views');

const backLink = `/before-you-start/granted-or-refused-householder`;
const shutterPage = '/before-you-start/you-cannot-appeal';
const enforcementNoticeHouseholder = `/before-you-start/enforcement-notice-householder`;

exports.getDateDecisionDueHouseholder = async (req, res) => {
  res.render(VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DATE_DECISION_DUE_HOUSEHOLDER, {
    backLink,
  });
};

exports.postDateDecisionDueHouseholder = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DATE_DECISION_DUE_HOUSEHOLDER, {
      decisionDate: {
        day: body['date-decision-due-householder-day'],
        month: body['date-decision-due-householder-month'],
        year: body['date-decision-due-householder-year'],
      },
      errors,
      errorSummary,
      backLink,
    });
  }

  const enteredDate = new Date(
    body['date-decision-due-householder-year'],
    (parseInt(body['date-decision-due-householder-month'], 10) - 1).toString(),
    body['date-decision-due-householder-day']
  );
  const deadlineDate = add(enteredDate, { months: 6, days: -1 });

  if (isBefore(enteredDate, deadlineDate)) {
    req.session.appeal.eligibility.appealDeadline = deadlineDate;
    return res.redirect(shutterPage);
  }

  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      decisionDate: enteredDate.toISOString(),
    });
    return res.redirect(enforcementNoticeHouseholder);
  } catch (e) {
    logger.error(e);

    return res.render(VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DATE_DECISION_DUE_HOUSEHOLDER, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: 'date-decision-due-householder' }],
      backLink,
    });
  }
};
