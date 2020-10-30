exports.getNoDecision = (req, res) => {
  res.render('eligibility/no-decision');
};

exports.getDecisionDate = (req, res) => {
  res.render('eligibility/decision-date');
};

exports.postDecisionDate = (req, res) => {

  var inputDate = new Date(body.decison-date-year, body.decision-date-month - 1, body.decision-date-day);
  var currentDate = new Date();
  var deadlineDate = new Date() - 84;

  if (inputDate instanceof Date && isNaN(date.valueOf())){ throw new Error('Date is invalid')} 
  else if (inputDate > currentDate) { throw new Error('Date cannot be in the future')}
  else if (inputDate < deadlineDate) {res.render('eligibility/decision-date-expired')}
  else { {res.render('eligibility/appeal-in-time')  }


}
 
};

exports.getDecisionDateExpired = (req, res) => {
  res.render('eligibility/decision-date-expired');
};
