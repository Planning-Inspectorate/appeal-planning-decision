const { rules, constants, validation } = require('@pins/business-rules');
const logger = require('../../lib/logger');


const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { APPEAL_TYPE } = require('../../constants');

exports.getDecisionDate = async (req, res) => {
  res.render(VIEW.FULL_APPEAL.DECISION_DATE, {
    backLink: `/before-you-start/granted-or-refused`,
  });
};

exports.postDecisionDate = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.FULL_APPEAL.DECISION_DATE, {
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

  const deadlineDate = rules.appeal.deadlineDate(enteredDate, APPEAL_TYPE.PLANNING_SECTION_78);
  const { time, duration } = rules.appeal.deadlinePeriod(APPEAL_TYPE.PLANNING_SECTION_78);

  const isWithinExpiryPeriod = validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
    enteredDate,
    constants.APPEAL_ID.PLANNING_SECTION_78
  );

  if (!isWithinExpiryPeriod) {
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

    return res.render(VIEW.FULL_APPEAL.DECISION_DATE, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: 'decision-date' }],
      backLink: `/before-you-start/granted-or-refused`,
    });
  }
};
