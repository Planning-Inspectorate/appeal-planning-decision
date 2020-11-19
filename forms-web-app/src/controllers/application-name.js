const { VIEW } = require('../lib/views');

exports.getApplicationName = (req, res) => {
  res.render(VIEW.APPLICATION_NAME);
};

exports.postApplicationName = (req, res) => {
  res.redirect(`/${VIEW.TASK_LIST}`);
};
