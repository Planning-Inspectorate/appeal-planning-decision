const { VIEW } = require('../lib/views');

exports.getIndex = (req, res) => {
  res.redirect(`/${VIEW.ELIGIBILITY.DECISION_DATE}`);
};
