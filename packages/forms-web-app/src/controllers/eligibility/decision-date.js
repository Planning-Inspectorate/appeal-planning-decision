const { VIEW } = require('../../lib/views');

exports.getNoDecision = (req, res) => {
  res.render(VIEW.ELIGIBILITY.NO_DECISION);
};

exports.getDecisionDate = (req, res) => {
  res.render(VIEW.ELIGIBILITY.DECISION_DATE);
};

exports.postDecisionDate = (req, res) => {
  const { body } = req;
  /* istanbul ignore next */
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length === 1 && errors['decision-date'] && errors['decision-date'].msg) {
    const parsed = JSON.parse(errors['decision-date'].msg);

    /* istanbul ignore else */
    if (parsed.deadlineDate) {
      res.render(VIEW.ELIGIBILITY.DECISION_DATE_EXPIRED, {
        errors,
        errorSummary,
        deadlineDate: parsed.deadlineDate,
      });
      return;
    }
  }

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
      errors,
      errorSummary,
    });
    return;
  }

  res.redirect(`/${VIEW.ELIGIBILITY.PLANNING_DEPARTMENT}`);
};

exports.getDecisionDateExpired = (req, res) => {
  res.render(VIEW.ELIGIBILITY.DECISION_DATE_EXPIRED);
};
