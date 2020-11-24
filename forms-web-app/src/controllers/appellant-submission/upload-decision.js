const { VIEW } = require('../../lib/views');

exports.getUploadDecision = (req, res) => {
  res.render(VIEW.UPLOAD_DECISION);
};
