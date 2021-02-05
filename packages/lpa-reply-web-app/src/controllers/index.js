const { VIEW } = require('../lib/views');

exports.getIndex = (req, res) => {
  res.redirect(`/${VIEW.TASK_LIST}`);
};
