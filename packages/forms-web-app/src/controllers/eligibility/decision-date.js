const { VIEW } = require('../../lib/views');
const config = require('../../config');

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

  let redirectTo = `/${VIEW.ELIGIBILITY.PLANNING_DEPARTMENT}`;

  if (config.server.limitedRouting.enabled) {
    redirectTo = config.server.limitedRouting.serviceUrl;
  }

  res.redirect(redirectTo);
};

exports.getDecisionDateExpired = (req, res) => {
  res.render(VIEW.ELIGIBILITY.DECISION_DATE_EXPIRED);
};
