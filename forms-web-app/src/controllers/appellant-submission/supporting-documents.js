const { VIEW } = require('../../lib/views');

exports.getSupportingDocuments = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS);
};
