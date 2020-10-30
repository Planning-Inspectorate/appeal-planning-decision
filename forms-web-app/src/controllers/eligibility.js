const moment = require('moment');

exports.getNoDecision = (req, res) => {
  res.render('eligibility/no-decision');
};

exports.getDecisionDate = (req, res) => {
  res.render('eligibility/decision-date');
};

exports.postDecisionDate = (req, res) => {
  const { body } = req;
  const { errors } = body;

  // TO DO: Move this validation out to a service and try to
  // build a custom validator in express-validator
  // to combine day, month, year and use .isDate() validator.
  const day = req.body['decision-date-day'];
  const month = req.body['decision-date-month'];
  const year = req.body['decision-date-year'];

  const date = moment(`${year}-${month}-${day}`, 'Y-M-D', true);

  if (!date.isValid()) {
    errors.push({ 'decision-date': 'Invalid date' });
  }

  if (errors) {
    res.render('eligibility/decision-date', { errors });
  } else {
    const currentDate = moment();
    const deadlineDate = date.add(12, 'weeks');

    if (deadlineDate.isBefore(currentDate, 'days')) {
      res.render('eligibility/decision-date-expired', { deadlineDate });
    } else {
      res.redirect('/eligibility/planning-department');
    }
  }
};

exports.getDecisionDateExpired = (req, res) => {
  res.render('eligibility/decision-date-expired');
};
