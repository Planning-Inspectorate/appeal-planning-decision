const eligibilityNoDecision = (req, res) => {
  res.render('eligibility/no-decision', {
    title: 'Eligibility',
  });
};

module.exports = eligibilityNoDecision;
