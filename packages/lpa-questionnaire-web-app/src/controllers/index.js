const { VIEW } = require('../lib/views');

exports.getIndex = (req, res) => {
  res.redirect(`/${req.params.id}/${VIEW.TASK_LIST}`);
};
