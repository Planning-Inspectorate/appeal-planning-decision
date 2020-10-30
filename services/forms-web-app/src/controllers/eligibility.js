exports.getNoDecision = (req, res) => {
  res.render('eligibility/no-decision');
};

exports.getDecisionDate = (req, res) => {
  res.render('eligibility/decision-date');
};

exports.postDecisionDate = (req, res) => {

  // Validate the body in req.body containing the date
  // if invalid, redirect to date invalid page
  // else redirect to date valid page.
};

exports.getDecisionDateOut = (req, res) => {
  res.render('eligibility/decision-date-expired');
};
