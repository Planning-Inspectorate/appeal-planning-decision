const { VIEW } = require('../../lib/views');

exports.getAppealStatement = (req, res) => {
  res.render(VIEW.ELIGIBILITY_APPEAL_STATEMENT);
};

exports.postAppealStatement = (req, res) => {
  res.redirect(`/${VIEW.TASK_LIST}`);
};
