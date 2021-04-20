const { VIEW } = require('../lib/views');

exports.getInformationSubmitted = (req, res) => {
  res.render(VIEW.INFORMATION_SUBMITTED, {});
};
