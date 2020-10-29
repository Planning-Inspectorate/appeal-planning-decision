exports.getNoDecision = (req, res) => {
  res.render('eligibility/no-decision');
};

exports.getDecisionDate = (req, res) => {
  res.render('eligibility/decision-date');
};

exports.getDecisionDateExpired = (req, res) => {
  res.render('eligibility/decision-date-expired');
};
