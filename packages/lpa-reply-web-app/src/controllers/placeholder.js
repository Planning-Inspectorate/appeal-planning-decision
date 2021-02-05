const { VIEW } = require('../lib/views');

exports.getPlaceholder = (_, res) => {
  res.render(VIEW.PLACEHOLDER);
};
