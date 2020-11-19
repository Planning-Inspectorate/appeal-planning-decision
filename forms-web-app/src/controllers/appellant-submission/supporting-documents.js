const { VIEW } = require('../../lib/views');

exports.getSupportingDocuments = (req, res) => {
  res.render(VIEW.SUPPORTING_DOCUMENTS);
};
