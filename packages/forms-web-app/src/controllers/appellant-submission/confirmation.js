const { VIEW } = require('../../lib/views');
const isDecisionDatePassed = require('../../lib/is-decision-date-passed');

exports.getConfirmation = (req, res) => {
  const appellantEmail = req.session && req.session.appeal && req.session.appeal['appellant-email'];
  const appealId = req.session.appeal.id;
  const decisionDatePassed = isDecisionDatePassed(req.session.appeal);

  if (decisionDatePassed) {
    res.redirect(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
  } else {
    req.session.appeal = null;
    res.render(VIEW.APPELLANT_SUBMISSION.CONFIRMATION, {
      appellantEmail,
      appealId,
    });
  }
};
