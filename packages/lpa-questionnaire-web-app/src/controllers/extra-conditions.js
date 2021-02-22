const { VIEW } = require('../lib/views');

exports.getExtraConditions = (req, res) => {
  res.render(`/${req.params.id}/${VIEW.EXTRA_CONDITIONS}`);
};
