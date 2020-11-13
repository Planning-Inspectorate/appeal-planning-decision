const VIEW = {
  DECISION_DATE: 'eligibility/decision-date',
  DECISION_DATE_EXPIRED: 'eligibility/decision-date-expired',
  NO_DECISION: 'eligibility/no-decision',
};

exports.getNoDecision = (req, res) => {
  res.render(VIEW.NO_DECISION);
};

exports.getDecisionDate = (req, res) => {
  res.render(VIEW.DECISION_DATE);
};

exports.postDecisionDate = (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = {} } = body;

  if (Object.keys(errors).length === 1 && errors['decision-date'] && errors['decision-date'].msg) {
    const parsed = JSON.parse(errors['decision-date'].msg);

    if (parsed.deadlineDate) {
      res.render(VIEW.DECISION_DATE_EXPIRED, {
        errors,
        errorSummary,
        deadlineDate: parsed.deadlineDate,
      });
      return;
    }
  }

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.DECISION_DATE, {
      errors,
      errorSummary,
    });
    return;
  }

  res.redirect('/eligibility/planning-department');
};

exports.getDecisionDateExpired = (req, res) => {
  res.render(VIEW.DECISION_DATE_EXPIRED);
};
